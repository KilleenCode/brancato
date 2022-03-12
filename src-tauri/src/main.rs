#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod config;
mod windows;
mod workflows;

use std::{env, sync::Mutex};
use tauri::{
  AppHandle, CustomMenuItem, GlobalShortcutManager, Manager, RunEvent, State, SystemTray,
  SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

use config::Config;
use windows::focus_window;
use workflows::run_step;

#[derive(Default)]
struct AppState(Mutex<Config>);

fn _get_state(state: State<AppState>) -> Config {
  let config_mutex = state.0.lock().expect("Could not lock mutex");
  let config = config_mutex.clone();
  config
}

fn update_config_and_state(
  app: &AppHandle,
  state: State<AppState>,
  new_config: Config,
) -> Result<(), tauri::Error> {
  let mut app_state = state.0.lock().expect("Could not lock mutex");
  config::set_config(&new_config);
  *app_state = new_config;

  app
    .get_window("omnibar")
    .unwrap()
    .emit("state-updated", "")?;
  Ok(())
}

#[tauri::command]
fn save_workflows(
  state: State<AppState>,
  app: AppHandle,
  config: Config,
) -> Result<(), tauri::Error> {
  update_config_and_state(&app, state, config).ok();

  Ok(())
}

#[tauri::command]
fn get_state(state: State<AppState>) -> Config {
  _get_state(state)
}

#[tauri::command]
async fn run_workflow(state: State<'_, AppState>, label: String) -> Result<(), ()> {
  let current_state = _get_state(state);

  let mut workflow = current_state
    .workflows
    .into_iter()
    .find(|x| x.name == label)
    .expect("Couldn't find workflow");

  let _ = &workflow
    .steps
    .iter_mut()
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
  state: State<'_, AppState>,
  shortcut: String,
) -> Result<(), tauri::Error> {
  let config = _get_state(state.clone());

  let new_config = Config {
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

  update_config_and_state(app_ref, state, new_config).ok();
  Ok(())
}

fn open_omnibar(app: &AppHandle) -> Result<(), tauri::Error> {
  let label = "omnibar".to_owned();
  focus_window(app, String::from(&label))?;
  app.get_window(&label).unwrap().emit("omnibar-focus", "")?;

  Ok(())
}
fn main() {
  let user_config = config::get_config();

  let quit = CustomMenuItem::new("quit", "Quit");
  let hide = CustomMenuItem::new("hide", "Hide");
  let settings = CustomMenuItem::new("settings", "Settings");
  let tray_menu = SystemTrayMenu::new()
    .add_item(quit)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(settings)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(hide);
  let system_tray = SystemTray::new().with_menu(tray_menu);
  let app = tauri::Builder::default()
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        // tauri::window::WindowBuilder::new(
        //   app,
        //   "settings",
        //   tauri::WindowUrl::App("/settings".into()),
        // );
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
    .manage(AppState(Mutex::new(user_config)))
    .invoke_handler(tauri::generate_handler![
      get_state,
      save_workflows,
      run_workflow,
      open_settings,
      set_shortcut
    ])
    .build(tauri::generate_context!())
    .expect("error while running tauri application");

  app.run(|app_handle, e| match e {
    // Application is ready (triggered only once)
    RunEvent::Ready => {
      let app_handle = app_handle.clone();
      let startup_shortcut = _get_state(app_handle.state::<AppState>()).shortcut;

      app_handle
        .global_shortcut_manager()
        .register(&startup_shortcut, move || {
          open_omnibar(&app_handle).ok();
        })
        .expect("Couldn't create shortcut");
    }

    // // Triggered when a window is trying to close
    RunEvent::CloseRequested { label, api, .. } => {
      api.prevent_close();
      let _ = &app_handle.get_window(&label).unwrap().hide().unwrap();
    }

    // Keep the event loop running even if all windows are closed
    // This allow us to catch system tray events when there is no window
    RunEvent::ExitRequested { api, .. } => {
      api.prevent_exit();
    }
    _ => {}
  })
}
