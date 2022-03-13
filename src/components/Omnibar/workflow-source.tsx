import { AutocompleteSource } from "@algolia/autocomplete-js";
import { invoke } from "@tauri-apps/api";
import { Commands } from "../../utils";
import { Action } from "../Autocomplete";

type WorkflowResult = {
  label: string;
};
const handleRunWorkflow = async (label: string) => {
  invoke(Commands.RunWorkflow, { label });
};

const createWorkflowSource = ({
  suggestions,
  pattern,
}: {
  suggestions: string[];
  pattern: RegExp;
}): AutocompleteSource<WorkflowResult> => ({
  sourceId: "workflows",
  getItemInputValue({ item }: { item: any }) {
    return item.label;
  },
  getItems({ state }: { state: any }) {
    return suggestions
      .filter((label) => pattern.test(label))

      .map((sug) => ({
        label: sug,
        // highlighted: highlight(sug, pattern),
      }));
  },
  // Run this code when item is selected
  onSelect(params: any) {
    // item is the full item data
    // setQuery is a hook to set the query state
    const { item, setQuery } = params;

    handleRunWorkflow(item.label);
    setQuery("");
  },
  // Templates for Header of this source and Items in this source
  templates: {
    header() {
      return <h2>Workflows</h2>;
    },
    item({ item }: { item: any }) {
      return <Action hit={item} />;
    },
  },
});

export default createWorkflowSource;
