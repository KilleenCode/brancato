use tauri::{AppHandle, Manager};

pub fn focus_window(app: &AppHandle, label: String) -> Result<(), tauri::Error> {
  let window = app.get_window(&label).unwrap();

  let main_monitor = window
    .primary_monitor()
    .expect("Couldn't get primary monitor");

  match main_monitor {
    Some(monitor) => {
      window
        .set_position(*monitor.position())
        .expect("Couldn't set position");
      window.center().expect("Failed to center")
    }
    _ => (),
  }

  window.show()?;
  window.unminimize()?;
  window.set_focus()?;
  Ok(())
}
