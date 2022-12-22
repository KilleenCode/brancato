extern crate open;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, env, path::Path};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Step {
  pub value: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Workflow {
  pub name: String,
  pub steps: Vec<Step>,
  pub arguments: Option<Vec<String>>,
}

// On Windows, some apps expect a relative working directory (Looking at you, OBS....)
pub fn open_app(path: &str) {
  let path = Path::new(&path);
  let dir = path.parent().expect("Path doesn't exist");
  env::set_current_dir(dir).expect("Couldn't set current dir");
  open::that(path).expect("Dang")
}

pub fn run_step(path: &str, args: Option<HashMap<String, String>>) {
  let mut target = path.to_string();
  if let Some(args) = args {
    for (key, value) in args {
      target = target.replace(&format!("${}", key), &value);
    }
  }
  println!("target: {:?}", &target);
  if target.contains("http://") || target.contains("https://") {
    open::that_in_background(&target);
  } else {
    open_app(&target);
  }
}
