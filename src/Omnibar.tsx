import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { Action, Autocomplete } from "./components/Autocomplete";
import { getConfig } from "./utils";

enum AppEvents {
  OmnibarFocused = "omnibar-focus",
  AppStateUpdated = "state-updated",
}

const focusSearchBar = () => {
  let input = document.querySelector(".aa-Input") as HTMLElement | null;
  input?.focus();
};
const Omnibar = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  async function setStoredConfigChoices() {
    let state = await getConfig();
    setSuggestions(state.workflows.map((wf) => wf.name));
  }
  useEffect(() => {
    const unlisten1 = appWindow.listen(
      AppEvents.OmnibarFocused,
      focusSearchBar
    );
    const unlisten2 = appWindow.listen(
      AppEvents.AppStateUpdated,
      setStoredConfigChoices
    );

    return () => {
      unlisten1();
      unlisten2();
    };
  }, []);

  useEffect(() => {
    setStoredConfigChoices();
  }, []);

  const handleRunWorkflow = async (label: string) => {
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
              sourceId: "workflows",
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
                  return <Action hit={item} />;
                },
              },
            },
            {
              sourceId: "settings",
              getItemInputValue({ item }: { item: any }) {
                return item.label;
              },
              getItems({ state }: { state: any }) {
                return [{ label: "Settings", action: "open_settings" }];
              },
              // Run this code when item is selected
              onSelect(params: any) {
                // item is the full item data
                // setQuery is a hook to set the query state
                const { item, setQuery } = params;

                invoke(item.action);
                setQuery("");
              },
              // Templates for Header of this source and Items in this source
              templates: {
                header() {
                  return <h2>Settings</h2>;
                },
                item({ item }: { item: any }) {
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
