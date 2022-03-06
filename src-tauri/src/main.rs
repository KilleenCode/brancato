#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::env;
use std::path::Path;
use tauri::Manager;
use tauri::{
  AppHandle, CustomMenuItem, GlobalShortcutManager, RunEvent, SystemTray, SystemTrayEvent,
  SystemTrayMenu, SystemTrayMenuItem, Window,
};
extern crate open;

struct Workflow {
  name: String,
  steps: Vec<String>,
}

// On Windows, some apps expect a relative working directory (Looking at you, OBS....)
fn open_app(path: &str) {
  let path = Path::new(&path);
  println!("{}", path.display());
  let dir = path.parent().expect("Path doesn't exist");
  env::set_current_dir(dir);
  open::that(path).expect("Dang")
}

#[tauri::command]
fn test_workflow(paths: Vec<String>) {
  let settings = Workflow {
    name: String::from("test workflow"),
    steps: paths,
  };

  for p in settings.steps {
    if p.contains("https") {
      open::that_in_background(p);
    } else {
      open_app(&p);
    }
  }
}

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
        // let window = app.get_window("main").unwrap();
        // window.show().unwrap();
        // window.unminimize().unwrap();
        // window.set_focus().unwrap();
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
    .invoke_handler(tauri::generate_handler![test_workflow])
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
