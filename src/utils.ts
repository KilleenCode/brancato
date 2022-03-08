import { invoke } from "@tauri-apps/api";
import { Workflows } from "./Config";

export const getConfig = async () => {
  const test = (await invoke("get_state")) as Workflows;
  return test;
};
