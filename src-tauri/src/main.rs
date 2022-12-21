#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod app_config;
mod user_config;
mod windows;
mod workflows;
use app_config::{set_custom_user_config_path, AppConfig};
use auto_launch::{AutoLaunch, AutoLaunchBuilder};
use rayon::prelude::*;
use serde::Serialize;
use std::{path::PathBuf, sync::Mutex};
use tauri::{
  api::dialog::blocking::FileDialogBuilder, utils::platform::current_exe, AppHandle,
  CustomMenuItem, GlobalShortcutManager, Manager, RunEvent, State, SystemTray, SystemTrayEvent,
  SystemTrayMenu, SystemTrayMenuItem,
};

use user_config::{set_user_config, UserConfig};
use windows::focus_window;
use workflows::run_step;

#[derive(Default, Serialize)]
struct AppState {
  user_config: UserConfig,
  app_config: AppConfig,
}

fn update_user_config_and_state(
  app: &AppHandle,
  user_config: State<Mutex<UserConfig>>,
  new_config: UserConfig,
) -> Result<(), tauri::Error> {
  let mut app_state = user_config.lock().expect("Could not lock mutex");
  set_user_config(&new_config);
  *app_state = new_config;

  app
    .get_window("omnibar")
    .unwrap()
    .emit("state-updated", "")?;
  Ok(())
}

#[tauri::command]
fn save_user_config(
  state: State<Mutex<UserConfig>>,
  app: AppHandle,
  config: UserConfig,
) -> Result<&str, tauri::Error> {
  update_user_config_and_state(&app, state, config).ok();

  Ok("Success!".into())
}

#[tauri::command]
fn get_state(
  user_config_state: State<Mutex<UserConfig>>,
  app_config_state: State<Mutex<AppConfig>>,
) -> AppState {
  let user_config = user_config_state
    .lock()
    .expect("Could not lock mutex")
    .clone();

  let app_config = app_config_state
    .lock()
    .expect("Couldn't lock mutex")
    .clone();

  let state = AppState {
    user_config,
    app_config,
  };
  return state;
}

fn set_default_path(
  mut dialog_builder: FileDialogBuilder,
  default_path: PathBuf,
) -> FileDialogBuilder {
  if default_path.is_file() || !default_path.exists() {
    if let (Some(parent), Some(file_name)) = (default_path.parent(), default_path.file_name()) {
      dialog_builder = dialog_builder.set_directory(parent);
      dialog_builder = dialog_builder.set_file_name(&file_name.to_string_lossy().to_string());
    } else {
      dialog_builder = dialog_builder.set_directory(default_path);
    }
    dialog_builder
  } else {
    dialog_builder.set_directory(default_path)
  }
}

#[tauri::command]
async fn select_file(default_path: Option<PathBuf>) -> Option<PathBuf> {
  let dialog = match default_path {
    Some(default_path) => {
      let file_exists = std::path::Path::exists(&default_path);
      if file_exists {
        set_default_path(FileDialogBuilder::new(), default_path)
      } else {
        FileDialogBuilder::new()
      }
    }
    None => FileDialogBuilder::new(),
  };

  dialog.pick_file()
}

#[tauri::command]
fn set_user_config_path(app_config_state: State<Mutex<AppConfig>>) -> Option<PathBuf> {
  let folder_path = FileDialogBuilder::new().pick_folder();

  match folder_path {
    Some(path) => match set_custom_user_config_path(path.clone()) {
      Ok(updated_config) => {
        let mut state = app_config_state.lock().expect("Couldn't lock");

        *state = updated_config;
        Some(path)
      }
      Err(_) => None,
    },
    None => None,
  }
}

#[tauri::command]
async fn run_workflow(
  state: State<'_, Mutex<UserConfig>>,
  name: String,
  args: Vec<String>,
) -> Result<(), ()> {
  let workflows = state.lock().expect("Can't unlock").clone().workflows;
  print!("{:?}", workflows);
  print!("{:?}", args);

  workflows
    .into_iter()
    .find(|x| x.name == name)
    .expect("Couldn't find workflow")
    .steps
    .par_iter_mut()
    .for_each(|step| run_step(&step.value));

  Ok(())
}

#[tauri::command]
async fn open_settings(app: AppHandle) -> Result<(), tauri::Error> {
  focus_window(&app, "settings".to_owned())?;
  Ok(())
}

#[tauri::command]
async fn set_shortcut(
  app: AppHandle,
  user_config: State<'_, Mutex<UserConfig>>,
  shortcut: String,
) -> Result<(), tauri::Error> {
  let config = user_config.lock().expect("Could not lock mutex").clone();

  let new_config = UserConfig {
    shortcut: shortcut.to_owned(),
    ..config.to_owned()
  };

  let app_ref = &app.clone();
  app
    .global_shortcut_manager()
    .unregister(&config.shortcut)
    .ok();
  app
    .global_shortcut_manager()
    .register(&new_config.shortcut, move || {
      open_omnibar(&app).ok();
    })
    .ok();

  update_user_config_and_state(app_ref, user_config, new_config).ok();
  Ok(())
}

fn open_omnibar(app: &AppHandle) -> Result<(), tauri::Error> {
  let label = "omnibar".to_owned();
  focus_window(app, String::from(&label))?;
  app.get_window(&label).unwrap().emit("omnibar-focus", "")?;

  Ok(())
}

pub fn init_autolaunch() -> AutoLaunch {
  let app_exe = current_exe().unwrap();
  let app_exe = dunce::canonicalize(app_exe).unwrap();
  let app_name = app_exe.file_stem().unwrap().to_str().unwrap();
  let app_path = app_exe.as_os_str().to_str().unwrap();

  AutoLaunchBuilder::new()
    .set_app_name(app_name)
    .set_app_path(app_path)
    .build()
}

fn main() {
  pretty_env_logger::init();
  let autolaunch = init_autolaunch();
  autolaunch.enable().unwrap();
  let app_config = app_config::get_or_create_app_config();
  let user_config = user_config::get_user_config(app_config.user_config_path.clone());

  let app = tauri::Builder::default()
    .system_tray(SystemTray::new())
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        focus_window(app, "settings".to_owned()).ok();
      }

      SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        "quit" => {
          std::process::exit(0);
        }
        "settings" => {
          focus_window(app, "settings".to_owned()).ok();
        }
        "hide" => {
          app.get_window("settings").unwrap().hide().unwrap();
        }
        _ => {}
      },
      _ => {}
    })
    .on_window_event(|event| match event.event() {
      tauri::WindowEvent::Focused(focused) => match event.window().label() {
        "settings" => {}
        "omnibar" => {
          if !focused {
            event.window().hide().expect("Failed to hide window");
          }
        }
        _ => {}
      },
      _ => {}
    })
    .manage(Mutex::new(user_config))
    .manage(Mutex::new(app_config))
    .invoke_handler(tauri::generate_handler![
      get_state,
      save_user_config,
      run_workflow,
      open_settings,
      set_shortcut,
      select_file,
      set_user_config_path
    ])
    .setup(|app_handle| {
      let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("quit", "Quit"))
        .add_item(CustomMenuItem::new("settings", "Settings"))
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(
          CustomMenuItem::new(
            "version",
            format!(
              "Version {version}",
              version = &app_handle.package_info().version
            ),
          )
          .disabled(),
        );
      app_handle
        .tray_handle()
        .set_menu(tray_menu)
        .expect("Set the tray damn it");
      Ok(())
    })
    .build(tauri::generate_context!())
    .expect("error while running tauri application");

  app.run(|app_handle, e| match e {
    // Application is ready (triggered only once)
    RunEvent::Ready => {
      let app_handle = app_handle.clone();
      let startup_shortcut = app_handle
        .state::<Mutex<UserConfig>>()
        .lock()
        .expect("Could not lock mutex")
        .clone()
        .shortcut;

      app_handle
        .global_shortcut_manager()
        .register(&startup_shortcut, move || {
          open_omnibar(&app_handle).ok();
        })
        .expect("Couldn't create shortcut");
    }

    // Triggered when a window is trying to close
    RunEvent::WindowEvent { label, event, .. } => match event {
      tauri::WindowEvent::CloseRequested { api, .. } => {
        api.prevent_close();
        let _ = &app_handle.get_window(&label).unwrap().hide().unwrap();
      }
      _ => {}
    },

    // Keep the event loop running even if all windows are closed
    // This allow us to catch system tray events when there is no window
    RunEvent::ExitRequested { api, .. } => {
      api.prevent_exit();
    }
    _ => {}
  })
}
