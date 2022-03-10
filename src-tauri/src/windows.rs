use tauri::{AppHandle, Manager};

pub fn focus_window(app: &AppHandle, label: String) -> Result<(), tauri::Error> {
  let window = app.get_window(&label).unwrap();
  window.show()?;
  window.unminimize()?;
  window.set_focus()?;
  Ok(())
}
