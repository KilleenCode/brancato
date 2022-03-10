use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Step {
  pub value: String,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Workflow {
  pub name: String,
  pub steps: Vec<Step>,
}
