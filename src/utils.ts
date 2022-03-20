import { invoke } from "@tauri-apps/api";
import { UserConfig } from "./Config";

export enum AppEvents {
  OmnibarFocused = "omnibar-focus",
  AppStateUpdated = "state-updated",
}

export enum Commands {
  RunWorkflow = "run_workflow",
  SetShortcut = "set_shortcut",
  OpenSettings = "open_settings",
  GetState = "get_state",
  SaveUserConfig = "save_user_config",
  UpdateConfigPath = "set_user_config_path",
}

type AppConfig = {
  user_config_path: String;
};

export type AppState = { user_config: UserConfig; app_config: AppConfig };

export const getConfig = async () => {
  return (await invoke(Commands.GetState)) as AppState;
};
