import { useEffect } from "react";

import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { dialog } from "@tauri-apps/api";
import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import WorkflowArray from "./forms/workflow-array";

type Workflow = {
  name: string;
  steps: {
    value: string;
  }[];
};

type FormValues = {
  workflows: Workflow[];
};
const getState = async () => {
  const test = (await invoke("get_state")) as string;
  return test;
};
export const defaultWorkflow = {
  name: "",
  steps: [{ value: "" }],
};
const defaultValues = {
  workflows: [defaultWorkflow],
};
function App() {
  // const [pathFromFile, setPathFromFile] = useState<string | undefined>();

  const { control, register, handleSubmit, getValues, setValue, reset } =
    useForm<FormValues>({
      defaultValues,
    });

  const onSubmit = (data: FormValues) => {
    invoke("save_workflows", { config: data });
  };
  useEffect(() => {
    async function setStoredConfigAsDefaults() {
      let state = JSON.parse(await getState());
      console.log({ defaultValues, state });
      reset(state);
    }
    setStoredConfigAsDefaults();
  }, [reset]);

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

export default App;
