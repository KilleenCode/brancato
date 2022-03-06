import React, { useEffect, useState } from "react";

import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { app, dialog } from "@tauri-apps/api";
import { DevTool } from "@hookform/devtools";
import { useFieldArray, useForm } from "react-hook-form";
import { register as registerShortcut } from "@tauri-apps/api/globalShortcut";
import { getCurrent as getCurrentWindow } from "@tauri-apps/api/window";

let shortcut = "CmdOrControl+Space+D";

registerShortcut(shortcut, () => {
  const currentWindow = getCurrentWindow();
  currentWindow.show();
});

const MY_SITES = [
  "https://twitter.com",
  "C:/Program Files/Microsoft VS Code/Code.exe",
  "C:/Program Files/obs-studio/bin/64bit/obs64.exe",
  "C:/Program Files/NVIDIA Corporation/NVIDIA Broadcast/NVIDIA Broadcast UI.exe",
];

const openTheThings = (paths: string[]) => invoke("test_workflow", { paths });

type FormValues = {
  name: string;
  filePaths: {
    path: string;
  }[];
};
function App() {
  const [pathFromFile, setPathFromFile] = useState<string | undefined>();
  const { control, register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: "",
      filePaths: [{ path: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "filePaths", // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name
  });

  const onSubmit = (data: FormValues) => {
    const paths = data.filePaths.map((p) => p.path);
    openTheThings(paths);
  };

  const addFilePath = () => {
    dialog.open({ multiple: false }).then((data) => {
      console.log(data);
      let path = data as string;
      setPathFromFile(path);
    });
  };
  useEffect(() => {
    if (pathFromFile) {
      append({
        path: pathFromFile,
      });
      setPathFromFile(undefined);
    }
  }, [pathFromFile]);
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Workflow Name
            <input {...register("name")} />
          </label>
          <hr />
          <h2>Steps</h2>
          {fields.map((field, index) => (
            <div key={field.id}>
              <input {...register(`filePaths.${index}.path`)} />
              <button type="button" onClick={() => remove(index)}>
                DELETE
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                path: "",
              })
            }
          >
            Add
          </button>
          <button type="button" onClick={addFilePath}>
            Add file/program
          </button>
          <button type="submit">Run workflow</button>
        </form>
      </header>
      <DevTool control={control} />
    </div>
  );
}

export default App;
