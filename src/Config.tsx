import "./App.css";
import Shortcut from "./components/Shortcut";
import * as Tabs from "@radix-ui/react-tabs";
import WorkflowSettings from "./forms/workflow-settings";
import Filepath from "./components/Filepath";

export type Workflow = {
  name: string;
  steps: {
    value: string;
  }[];
};

export type UserConfig = {
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
            <hr />
            <Filepath />
          </Tabs.Content>
        </Tabs.Root>
      </header>
    </div>
  );
}

export default Config;
