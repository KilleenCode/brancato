import { AutocompleteSource } from "@algolia/autocomplete-js";
import { invoke } from "@tauri-apps/api";
import { Workflow } from "../../Config";
import { Commands, getConfig } from "../../utils";
import { Action } from "./Action";

type WorkflowResult = Workflow & { label: string };
const handleRunWorkflow = async (
  workflow: Workflow,
  args: Record<string, any> = {}
) => {
  console.log("handleRunWorkflow", { workflow, args });
  invoke(Commands.RunWorkflow, { name: workflow.name, args: args });
};

const createWorkflowSource = ({
  pattern,
}: {
  pattern: RegExp;
}): AutocompleteSource<WorkflowResult> => ({
  sourceId: "workflows",
  getItemInputValue({ item }: { item: any }) {
    return item.name;
  },
  async getItems({ state, ...rest }: { state: any }) {
    const config = await getConfig();
    const { workflows } = config.user_config;

    return workflows
      .filter((workflow) => pattern.test(workflow.name))
      .map((w) => {
        return {
          ...w,
          label: w.name,
          description:
            w.arguments && w.arguments.length > 0
              ? "Arguments: " + w.arguments.join(", ")
              : "",
        };
      });
  },
  // Run this code when item is selected
  onSelect(params) {
    // item is the full item data
    // setQuery is a hook to set the query state
    const { item, setQuery, setContext, setCollections } = params;
    if (item.arguments) {
      setContext({
        searchPrefix: item.arguments[0],
        workflow: item,
        onComplete: (args: Record<string, any>) => {
          console.log("onComplete", args);
          setQuery("");
          setContext({ searchPrefix: null });
          handleRunWorkflow(item, args);
        },
      });
      setCollections([]);
      setQuery("");
    } else {
      handleRunWorkflow(item);
      setQuery("");
    }
  },
  // Templates for Header of this source and Items in this source
  templates: {
    header() {
      return <h2>Workflows</h2>;
    },
    item({ item }: { item: WorkflowResult }) {
      return <Action hit={item} />;
    },
  },
});

export default createWorkflowSource;
