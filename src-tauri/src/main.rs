#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::env;
use std::path::Path;
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

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![test_workflow])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
