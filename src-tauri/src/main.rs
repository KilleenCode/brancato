#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod config;
mod workflows;

use std::{env, path::Path, sync::Mutex};
use tauri::Manager;
use tauri::{
  AppHandle, CustomMenuItem, GlobalShortcutManager, RunEvent, SystemTray, SystemTrayEvent,
  SystemTrayMenu, SystemTrayMenuItem, Window,
};
use workflows::Workflow;
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
fn get_state(state: tauri::State<AppState>) -> String {
  let mut config = state.0.lock().expect("Could not lock mutex");
  String::from(&*config)
}

// #[tauri::command]
// fn run_workflow(workflow: Workflow) {
//   for p in workflow.steps {
//     if p.contains("https") {
//       open::that_in_background(p);
//     } else {
//       open_app(&p);
//     }
//   }
// }

fn get_settings_window(app: &AppHandle) -> Window {
  app.get_window("main").unwrap()
}

fn focus_settings(app: &AppHandle) {
  let window = get_settings_window(app);
  window.show().unwrap();
  window.unminimize().unwrap();
  window.set_focus().unwrap();
}

fn main() {
  let user_config = config::get_config();

  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let hide = CustomMenuItem::new("hide".to_string(), "Hide");
  let tray_menu = SystemTrayMenu::new()
    .add_item(quit)
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
        focus_settings(app);
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
        "hide" => {
          let window = get_settings_window(app);
          window.hide().unwrap();
        }
        _ => {}
      },
      _ => {}
    })
    .manage(AppState(Mutex::new(
      serde_json::to_string(&user_config).expect("couldnt serialize"),
    )))
    .invoke_handler(tauri::generate_handler![save_workflows, get_state])
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
          focus_settings(&app_handle);
          println!("Shortcut fired");
        })
        .unwrap();
    }

    // // Triggered when a window is trying to close
    // RunEvent::CloseRequested { label, api, .. } => {
    //   let app_handle = app_handle.clone();
    //   let window = app_handle.get_window(&label).unwrap();
    //   // use the exposed close api, and prevent the event loop to close
    //   api.prevent_close();
    //   // ask the user if he wants to quit
    //   ask(
    //     Some(&window),
    //     "Tauri API",
    //     "Are you sure that you want to close this window?",
    //     move |answer| {
    //       if answer {
    //         // .close() cannot be called on the main thread
    //         std::thread::spawn(move || {
    //           app_handle.get_window(&label).unwrap().close().unwrap();
    //         });
    //       }
    //     },
    //   );
    // }

    // Keep the event loop running even if all windows are closed
    // This allow us to catch system tray events when there is no window
    RunEvent::ExitRequested { api, .. } => {
      api.prevent_exit();
    }
    _ => {}
  })
}
