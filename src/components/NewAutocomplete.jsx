import { createAutocomplete } from "@algolia/autocomplete-core";
import { useState, useMemo } from "react";
import { appWindow } from "@tauri-apps/api/window";

function Autocomplete({ getSources }) {
  // (1) Create a React state.
  const [autocompleteState, setAutocompleteState] = useState({});
  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        placeholder: "",
        openOnFocus: true,
        autoFocus: true,
        defaultActiveItemId: 0,
        onStateChange({ state }) {
          // (2) Synchronize the Autocomplete state with the state.
          setAutocompleteState(state);
        },
        getSources({ ...props }) {
          return getSources({ ...props });
        },
      }),
    []
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const argValue = {
          [autocompleteState.context.searchPrefix]: autocompleteState.query,
        };
        console.log("argValue", argValue);
        autocompleteState.context.onComplete &&
          autocompleteState.context.onComplete(argValue);
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "0.5rem 1rem",
          borderRadius: "4px",
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            autocomplete.setContext({ searchPrefix: null });
            appWindow.hide();
          }
        }}
      >
        <div className="aa-Autocomplete" {...autocomplete.getRootProps({})}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {autocompleteState.context?.searchPrefix && (
              <span style={{ fontWeight: 900 }}>
                {autocompleteState.context?.searchPrefix}:
              </span>
            )}
            <input className="aa-Input" {...autocomplete.getInputProps({})} />
          </div>

          <div className="aa-Panel" {...autocomplete.getPanelProps({})}>
            {autocompleteState.isOpen &&
              autocompleteState.collections.map((collection, index) => {
                const { source, items } = collection;

                return (
                  <div key={`source-${index}`} className="aa-Source">
                    {items.length > 0 && (
                      <ul className="aa-List" {...autocomplete.getListProps()}>
                        {items.map((item) => (
                          <li
                            key={item.objectID}
                            className="aa-Item"
                            {...autocomplete.getItemProps({
                              item,
                              source,
                            })}
                          >
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </form>
  );

  // ...
}

export default Autocomplete;
