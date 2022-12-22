import { AutocompleteSource } from "@algolia/autocomplete-js";
import { Action } from "./Action";

const createCalculatorSource = ({
  query,
  calculated,
  refresh,
}: {
  query: string;
  calculated: string;
  refresh: () => void;
}): AutocompleteSource<{ label: string }> => ({
  sourceId: "calculator",

  getItems() {
    return [{ label: query }];
  },
  // Run this code when item is selected
  onSelect(params: any) {
    const { setQuery } = params;

    try {
      navigator.clipboard.writeText(calculated);
    } catch (e) {
      console.log(e);
    }
    setQuery("");
    refresh();
  },
  // Templates for Header of this source and Items in this source
  templates: {
    header() {
      return <h3>{calculated}</h3>;
    },
    item({ item }: { item: any }) {
      return <Action hit={item} />;
    },
  },
});

export default createCalculatorSource;
