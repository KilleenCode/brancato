use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

const USER_CONFIG_FILE_NAME: &str = "config.json";
const APP_CONFIG_FILE_NAME: &str = "app-config.json";
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct AppConfig {
  #[serde(default = "default_user_config_path")]
  pub user_config_path: PathBuf,
}

impl Default for AppConfig {
  fn default() -> Self {
    let default_path = default_user_config_path();
    AppConfig {
      user_config_path: default_path,
    }
  }
}

fn default_dir() -> PathBuf {
  ProjectDirs::from("", "", "Brancato")
    .unwrap()
    .config_dir()
    .to_owned()
}

fn default_user_config_path() -> PathBuf {
  default_dir().join(USER_CONFIG_FILE_NAME)
}

fn default_app_config_path() -> PathBuf {
  default_dir().join(APP_CONFIG_FILE_NAME)
}

fn create_app_config(config: Option<AppConfig>) -> AppConfig {
  let default = match config {
    Some(c) => c,
    None => AppConfig::default(),
  };
  let data = serde_json::to_string(&default).expect("Unable to parse struct");
  let path = default_dir().join(APP_CONFIG_FILE_NAME);
  let prefix = path.parent().unwrap();
  fs::create_dir_all(prefix).unwrap();
  fs::write(path, data).expect("Unable to write file");

  return default;
}

pub fn get_or_create_app_config() -> AppConfig {
  let read_path = default_app_config_path();
  let config_file = fs::read_to_string(&read_path);
  let config: AppConfig = match config_file {
    Ok(file) => serde_json::from_str(&file).unwrap(),
    Err(_) => create_app_config(None),
  };
  return config;
}

pub fn set_custom_user_config_path(
  new_user_config_path: PathBuf,
) -> Result<AppConfig, std::io::Error> {
  let new_user_config_path = new_user_config_path.join(USER_CONFIG_FILE_NAME);

  let current_config = get_or_create_app_config();

  let new_config = AppConfig {
    user_config_path: new_user_config_path,
    ..current_config
  };

  fs::copy(
    &current_config.user_config_path,
    new_config.user_config_path.clone(),
  )
  .and_then(|_| fs::remove_file(current_config.user_config_path))?;

  Ok(create_app_config(Some(new_config.clone())))
}
