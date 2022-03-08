import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { dialog } from "@tauri-apps/api";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import WorkflowArray from "./forms/workflow-array";
import { getConfig } from "./utils";

export type Workflow = {
  name: string;
  steps: {
    value: string;
  }[];
};

export type Workflows = {
  workflows: Workflow[];
};

export const defaultWorkflow = {
  name: "",
  steps: [{ value: "" }],
};

function Config() {
  // const [pathFromFile, setPathFromFile] = useState<string | undefined>();
  const [defaultValues, setDefaultValues] = useState<Workflows>({
    workflows: [defaultWorkflow],
  });
  const { control, register, handleSubmit, getValues, setValue, reset } =
    useForm<Workflows>({
      defaultValues,
    });

  const onSubmit = (data: Workflows) => {
    invoke("save_workflows", { config: data });
  };
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    async function setStoredConfigAsDefaults() {
      let state = await getConfig();
      setDefaultValues(state);
    }
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
      </header>
      {/* <button type="button" onClick={addFilePath}>
            Add file/program
          </button> */}
      <DevTool control={control} />
    </div>
  );
}

export default Config;
