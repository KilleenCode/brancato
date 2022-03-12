import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { DevTool } from "@hookform/devtools";
import { useForm, useFormState } from "react-hook-form";
import WorkflowArray from "./forms/workflow-array";
import { Commands, getConfig } from "./utils";
import Shortcut from "./components/Shortcut";
import * as Tabs from "@radix-ui/react-tabs";
import debounce from "lodash/debounce";

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

enum TabSections {
  WorkflowSettings = "Workflows",
  Preferences = "Preferences",
}

function Config() {
  // const [pathFromFile, setPathFromFile] = useState<string | undefined>();
  const [appConfig, setAppConfig] = useState<Workflows | undefined>();
  const [defaultValues, setDefaultValues] = useState<Workflows | undefined>();
  const [showSaving, setShowSaving] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState,
  } = useForm<Workflows>({
    defaultValues,
  });
  const { isSubmitting } = formState;
  const { isDirty, isValid } = useFormState({ control });

  useEffect(() => {
    setTimeout(() => {
      setShowSaving(true);
    });
    setTimeout(() => {
      setShowSaving(false);
    }, 300);
  }, [isSubmitting]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    handleSubmit((data: Workflows) => {
      invoke(Commands.SaveWorkflows, { config: data }).then(() => reset(data));
    }),
    [reset, handleSubmit]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = useCallback(debounce(onSubmit, 1200), []);

  useEffect(() => {
    if (isDirty && isValid) {
      debouncedSubmit();
    }
  }, [isDirty, isValid, debouncedSubmit]);

  //
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
        <p
          style={{
            opacity: showSaving ? 1 : 0,
            transition: "opacity 1s ease-out",
          }}
        >
          Saving...
        </p>
        <Tabs.Root defaultValue={TabSections.WorkflowSettings}>
          <Tabs.List>
            <Tabs.Trigger value={TabSections.WorkflowSettings}>
              {TabSections.WorkflowSettings}
            </Tabs.Trigger>
            <Tabs.Trigger value={TabSections.Preferences}>
              {TabSections.Preferences}
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value={TabSections.WorkflowSettings}>
            <form onSubmit={onSubmit}>
              <WorkflowArray
                {...{ control, register, defaultValues, getValues, setValue }}
              />
            </form>
          </Tabs.Content>
          <Tabs.Content value={TabSections.Preferences}>
            {" "}
            {appConfig && <Shortcut currentShortcut={appConfig.shortcut} />}
          </Tabs.Content>
        </Tabs.Root>
      </header>
      {/* <button type="button" onClick={addFilePath}>
            Add file/program
          </button> */}
      {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && (
        <DevTool control={control} />
      )}
    </div>
  );
}

export default Config;
