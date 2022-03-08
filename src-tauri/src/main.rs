#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod config;
mod workflows;

use std::{env, path::Path, sync::Mutex};
use tauri::{
  AppHandle, CustomMenuItem, GlobalShortcutManager, Manager, RunEvent, SystemTray, SystemTrayEvent,
  SystemTrayMenu, SystemTrayMenuItem,
};

extern crate open;

// On Windows, some apps expect a relative working directory (Looking at you, OBS....)
fn open_app(path: &str) {
  let path = Path::new(&path);
  println!("{}", path.display());
  let dir = path.parent().expect("Path doesn't exist");
  env::set_current_dir(dir);
  open::that(path).expect("Dang")
}

#[tauri::command]
fn save_workflows(state: tauri::State<AppState>, config: config::Config) {
  let mut app_state = state.0.lock().expect("Could not lock mutex");
  let config_as_string = serde_json::to_string(&config).expect("couldnt serialize");
  *app_state = config_as_string;
  config::set_config(config);
}

#[derive(Default)]
struct AppState(Mutex<String>);

#[tauri::command]
fn get_state(state: tauri::State<AppState>) -> config::Config {
  let config = state.0.lock().expect("Could not lock mutex");
  let hmm: config::Config = serde_json::from_str(&*config).expect("Couldn't convert state");
  hmm
}

#[tauri::command]
fn run_workflow(state: tauri::State<AppState>, label: String) {
  let current_state = get_state(state);

  let workflow = current_state
    .workflows
    .iter()
    .find(|x| x.name == label)
    .unwrap();

  let steps = &workflow.steps;

  dbg!(steps);
  for p in &workflow.steps {
    if p.value.contains("https") {
      open::that_in_background(&p.value);
    } else {
      open_app(&p.value);
    }
  }
}

fn focus_window(app: &AppHandle, label: String) {
  let window = app.get_window(&label).unwrap();
  window.show().unwrap();
  window.unminimize().unwrap();
  window.set_focus().unwrap();
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
        focus_window(app, "settings".to_owned());
      }
      SystemTrayEvent::RightClick {
        position: _,
        size: _,
        ..
      } => {
        println!("system tray received a right click");
      }
      SystemTrayEvent::DoubleClick {
        position: _,
        size: _,
        ..
      } => {
        println!("system tray received a double click");
      }
      SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        "quit" => {
          std::process::exit(0);
        }
        "settings" => focus_window(app, "settings".to_owned()),
        "hide" => {
          app.get_window("settings").unwrap().hide().unwrap();
        }
        _ => {}
      },
      _ => {}
    })
    .on_window_event(|event| match event.event() {
      tauri::WindowEvent::Focused(focused) => {
        let label = event.window().label();
        match label {
          "settings" => {}
          "omnibar" => {
            if !focused {
              event.window().hide();
            }
          }
          _ => {}
        }
      }
      _ => {}
    })
    .manage(AppState(Mutex::new(
      serde_json::to_string(&user_config).expect("couldnt serialize"),
    )))
    .invoke_handler(tauri::generate_handler![
      get_state,
      save_workflows,
      run_workflow
    ])
    .build(tauri::generate_context!())
    .expect("error while running tauri application");

  app.run(|app_handle, e| match e {
    // Application is ready (triggered only once)
    RunEvent::Ready => {
      let app_handle = app_handle.clone();
      app_handle
        .global_shortcut_manager()
        .register("Alt+Space", move || {
          let app_handle = app_handle.clone();
          focus_window(&app_handle, "omnibar".to_owned());
          println!("Alt+Space fired");
        })
        .unwrap();
    }

    // // Triggered when a window is trying to close
    RunEvent::CloseRequested { label, api, .. } => {
      api.prevent_close();
      let app_handle = app_handle.clone();
      app_handle.get_window(&label).unwrap().hide().unwrap();
    }

    // Keep the event loop running even if all windows are closed
    // This allow us to catch system tray events when there is no window
    RunEvent::ExitRequested { api, .. } => {
      api.prevent_exit();
    }
    _ => {}
  })
}
