import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { Action, Autocomplete } from "./components/Autocomplete";
import { AppEvents, Commands, getConfig } from "./utils";

const focusSearchBar = () => {
  let input = document.querySelector(".aa-Input") as HTMLElement | null;
  input?.focus();
};

function getQueryPattern(query: string, flags = "i") {
  const pattern = new RegExp(
    `(${query
      .trim() // Trim leading and ending whitespace
      .toLowerCase() // convert to lower case
      .split(" ") // Split on spaces for multiple commands
      .map((token) => `^${token}`) // Map over the resulting array and create Regex_
      .join("|")})`, // Join those expressions with an OR |
    flags
  );

  return pattern;
}

function highlight(text: string, pattern: RegExp) {
  // Split the text based on the pattern
  const tokens = text.split(pattern);

  // Map over the split text and test against the pattern
  return tokens.map((token) => {
    // If the pattern matches the text, wrap the text in <mark>
    if (!pattern.test("") && pattern.test(token)) {
      return <mark>{token}</mark>;
    }

    // return the token back to the array
    return token;
  });
}

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
    invoke(Commands.RunWorkflow, { label });
  };

  return (
    <div style={{ background: "rgb(0 0 0 / 0%)" }}>
      <form>
        <Autocomplete
          placeholder=""
          openOnFocus
          autoFocus
          defaultActiveItemId={0}
          getSources={({ query }: { query: any }) => {
            const pattern = getQueryPattern(query);
            return [
              {
                sourceId: "workflows",
                getItemInputValue({ item }: { item: any }) {
                  return item.label;
                },
                getItems({ state }: { state: any }) {
                  return suggestions
                    .filter((label) => pattern.test(label))
                    .map((sug) => ({
                      label: sug,
                      highlighted: highlight(sug, pattern),
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
              },
              {
                sourceId: "settings",
                getItemInputValue({ item }: { item: any }) {
                  return item.label;
                },
                getItems({ state }: { state: any }) {
                  return [{ label: "Settings", action: Commands.OpenSettings }]
                    .filter(({ label }) => pattern.test(label))
                    .map((action) => ({
                      ...action,
                      highlighted: highlight(action.label, pattern),
                    }));
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
                    console.log(item);
                    return <Action hit={item} />;
                  },
                },
              },
            ];
          }}
        />
      </form>
    </div>
  );
};

export default Omnibar;
