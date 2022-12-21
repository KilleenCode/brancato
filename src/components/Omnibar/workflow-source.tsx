import { AutocompleteSource } from "@algolia/autocomplete-js";
import { invoke } from "@tauri-apps/api";
import { Workflow } from "../../Config";
import { Commands, getConfig } from "../../utils";
import { Action } from "../Autocomplete";


type WorkflowResult = Workflow & { label: string }
const handleRunWorkflow = async (workflow: Workflow, args: string[] = []) => {
  console.log(workflow, args)
  invoke(Commands.RunWorkflow, { name: workflow.name, args });
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
    const { workflows } = config.user_config
    console.log('state', { state, rest, workflows })
    return workflows
      .filter((workflow) => pattern.test(workflow.name))
      .map((w) => {
        return {
          ...w,
          label: w.name,
        };
      })

  },
  // Run this code when item is selected
  onSelect(params) {
    // item is the full item data
    // setQuery is a hook to set the query state
    const { item, setQuery, setContext, setCollections, ...rest } = params;
    if (item.arguments) {
      setContext({
        searchPrefix: item.arguments[0], workflow: item, onComplete: (query: string, args?: string[]) => {
          console.log(item, query, args)
          handleRunWorkflow(item, args)
        }
      })
      console.log('do var workflow', { item, rest })
      setCollections([])
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
