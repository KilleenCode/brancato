import { invoke } from "@tauri-apps/api";
import { Workflows } from "./Config";

export enum AppEvents {
  OmnibarFocused = "omnibar-focus",
  AppStateUpdated = "state-updated",
}

export enum Commands {
  RunWorkflow = "run_workflow",
  SetShortcut = "set_shortcut",
  OpenSettings = "open_settings",
  GetState = "get_state",
  SaveWorkflows = "save_workflows",
}

export const getConfig = async () => {
  const test = (await invoke(Commands.GetState)) as Workflows;
  return test;
};
