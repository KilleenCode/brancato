import "./App.css";
import Shortcut from "./components/Shortcut";
import * as Tabs from "@radix-ui/react-tabs";
import WorkflowSettings from "./forms/workflow-settings";

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

enum TabSections {
  WorkflowSettings = "Workflows",
  Preferences = "Preferences",
}

function Config() {
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
            <WorkflowSettings />
          </Tabs.Content>
          <Tabs.Content value={TabSections.Preferences}>
            <Shortcut />
          </Tabs.Content>
        </Tabs.Root>
      </header>
      {/* <button type="button" onClick={addFilePath}>
            Add file/program
          </button> */}
      {/* {(!process.env.NODE_ENV || process.env.NODE_ENV === "development") && (
        <DevTool control={control} />
      )} */}
    </div>
  );
}

export default Config;
