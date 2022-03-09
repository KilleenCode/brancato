import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { Action, Autocomplete } from "./components/Autocomplete";
import { getConfig } from "./utils";

const focusSearchBar = () => {
  let input = document.querySelector(".aa-Input") as HTMLElement | null;
  console.log(input);
  input?.focus();
};
const Omnibar = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  useEffect(() => {
    const unlisten = appWindow.listen("omnibar-focus", focusSearchBar);

    return () => {
      unlisten();
    };
  }, []);
  useEffect(() => {
    async function setStoredConfigChoices() {
      let state = await getConfig();
      setSuggestions(state.workflows.map((wf) => wf.name));
    }
    setStoredConfigChoices();
  }, []);
  const handleRunWorkflow = (label: string) => {
    invoke("run_workflow", { label });
  };

  return (
    <div style={{ background: "rgb(0 0 0 / 0%)" }}>
      <form>
        <Autocomplete
          placeholder=""
          openOnFocus
          autoFocus
          defaultActiveItemId={0}
          getSources={({ query }: { query: any }) => [
            {
              sourceId: "actions",
              getItemInputValue({ item }: { item: any }) {
                return item.label;
              },
              getItems({ state }: { state: any }) {
                return suggestions.map((sug) => ({ label: sug }));
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
                  console.log({ item });
                  return <Action hit={item} />;
                },
              },
            },
          ]}
        />
      </form>
    </div>
  );
};

export default Omnibar;
