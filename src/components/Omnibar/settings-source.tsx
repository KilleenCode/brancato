import { invoke } from "@tauri-apps/api";
import { Commands } from "../../utils";
import { Action } from "../Autocomplete";

const createSettingsSource = ({ pattern }: { pattern: RegExp }) => ({
  sourceId: "settings",
  getItemInputValue({ item }: { item: any }) {
    return item.label;
  },
  getItems({ state }: { state: any }) {
    return [{ label: "Settings", action: Commands.OpenSettings }].filter(
      ({ label }) => pattern.test(label)
    );
    //TODO: add result highlighting
    // .map((action) => ({
    //   ...action,
    //   highlighted: highlight(action.label, pattern),
    // }));
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
});

export default createSettingsSource;
