use directories::ProjectDirs;
use serde::{Deserialize, Serialize};
use std::fs;

use super::workflows::Workflow;

#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct Config {
  pub workflows: Vec<Workflow>,
  #[serde(default = "default_shortcut")]
  pub shortcut: String,
}

impl Default for Config {
  fn default() -> Self {
    Config {
      workflows: Vec::new(),
      shortcut: "alt + m".to_string(),
    }
  }
}

fn default_shortcut() -> String {
  "alt + m".to_string()
}

pub fn get_config() -> Config {
  if let Some(proj_dirs) = ProjectDirs::from("", "", "Brancato") {
    let config_dir = proj_dirs.config_dir();
    let read_path = config_dir.join("config.json");

    let config_file = fs::read_to_string(&read_path);
    let config: Config = match config_file {
      Ok(file) => serde_json::from_str(&file).unwrap(),
      Err(_) => Config::default(),
    };

    return config;
  } else {
    Config::default()
  }
}

pub fn set_config(config: &Config) {
  if let Some(proj_dirs) = ProjectDirs::from("", "", "Brancato") {
    let config_dir = proj_dirs.config_dir();
    let data = serde_json::to_string(config).expect("Unable to parse struct");
    let path = config_dir.join("config.json");
    let prefix = path.parent().unwrap();
    fs::create_dir_all(prefix).unwrap();
    fs::write(path, data).expect("Unable to write file");
  }
}
