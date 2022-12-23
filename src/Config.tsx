import "./App.css";
import Shortcut from "./components/Shortcut";
import WorkflowSettings from "./forms/workflow-settings";
import Filepath from "./components/Filepath";
import {
  TabContainer,
  TabContent,
  TabTrigger,
  TabTriggerContainer,
} from "./components/core/Tabs";

export type Workflow = {
  name: string;
  arguments?: string[];
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
  arguments: [],
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
        <TabContainer defaultValue={TabSections.WorkflowSettings}>
          <TabTriggerContainer>
            <TabTrigger value={TabSections.WorkflowSettings}>
              {TabSections.WorkflowSettings}
            </TabTrigger>
            <TabTrigger value={TabSections.Preferences}>
              {TabSections.Preferences}
            </TabTrigger>
          </TabTriggerContainer>
          <TabContent value={TabSections.WorkflowSettings}>
            <WorkflowSettings />
          </TabContent>
          <TabContent value={TabSections.Preferences}>
            <Shortcut />
            <hr />
            <Filepath />
          </TabContent>
        </TabContainer>
      </header>
    </div>
  );
}

export default Config;
