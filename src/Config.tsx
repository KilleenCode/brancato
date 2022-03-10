import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import WorkflowArray from "./forms/workflow-array";
import { Commands, getConfig } from "./utils";
import Shortcut from "./components/Shortcut";

export type Workflow = {
  name: string;
  steps: {
    value: string;
  }[];
};

export type Workflows = {
  workflows: Workflow[];
  shortcut: string;
};

export const defaultWorkflow = {
  name: "",
  steps: [{ value: "" }],
};
export async function getConfigAndSet(setData: (state: Workflows) => void) {
  let state = await getConfig();
  setData(state);
}

function Config() {
  // const [pathFromFile, setPathFromFile] = useState<string | undefined>();
  const [appConfig, setAppConfig] = useState<Workflows | undefined>();
  const [defaultValues, setDefaultValues] = useState<Workflows | undefined>();
  const { control, register, handleSubmit, getValues, setValue, reset } =
    useForm<Workflows>({
      defaultValues,
    });

  const onSubmit = (data: Workflows) => {
    invoke(Commands.SaveWorkflows, { config: data });
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    appConfig && setDefaultValues(appConfig);
  }, [appConfig]);
  const setStoredConfigAsDefaults = () => getConfigAndSet(setAppConfig);
  useEffect(() => {
    setStoredConfigAsDefaults();
  }, []);

  // const addFilePath = () => {
  //   dialog.open({ multiple: false }).then((data) => {
  //     console.log(data);
  //     let path = data as string;
  //     setPathFromFile(path);
  //   });
  // };
  // useEffect(() => {
  //   if (pathFromFile) {
  //     append({
  //       path: pathFromFile,
  //     });
  //     setPathFromFile(undefined);
  //   }
  // }, [pathFromFile, append]);

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit(onSubmit)}>
          <WorkflowArray
            {...{ control, register, defaultValues, getValues, setValue }}
          />
          <button type="submit">Save</button>
        </form>
        {appConfig && (
          <Shortcut
            onUpdate={setStoredConfigAsDefaults}
            currentShortcut={appConfig.shortcut}
          />
        )}
      </header>
      {/* <button type="button" onClick={addFilePath}>
            Add file/program
          </button> */}
      <DevTool control={control} />
    </div>
  );
}

export default Config;
