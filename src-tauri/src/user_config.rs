use crate::app_config::get_or_create_app_config;

use super::workflows::Workflow;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct UserConfig {
  pub workflows: Vec<Workflow>,
  #[serde(default = "default_shortcut")]
  pub shortcut: String,
}

impl Default for UserConfig {
  fn default() -> Self {
    UserConfig {
      workflows: Vec::new(),
      shortcut: "alt + m".to_string(),
    }
  }
}

fn default_shortcut() -> String {
  "alt + m".to_string()
}

pub fn get_user_config(config_path: PathBuf) -> UserConfig {
  let config_file = fs::read_to_string(&config_path);
  match config_file {
    Ok(file) => serde_json::from_str(&file).unwrap(),
    Err(_) => {
      let default = UserConfig::default();
      set_user_config(&default);
      return default;
    }
  }
}

pub fn set_user_config(config: &UserConfig) {
  let config_path = get_or_create_app_config().user_config_path;
  let data = serde_json::to_string(config).expect("Unable to parse struct");
  let prefix = config_path.parent().unwrap();
  fs::create_dir_all(prefix).unwrap();
  fs::write(config_path, data).expect("Unable to write file");
}
