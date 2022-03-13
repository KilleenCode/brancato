import { AutocompleteSource } from "@algolia/autocomplete-js";
import { shell } from "@tauri-apps/api";
import { ReactNode } from "react";
import { Action } from "../Autocomplete";

type SearchEngineResult = {
  label: string;
  shortCode: string;
  url: (query: string) => string;
  suggestions?: (query: string) => string;
  description?: ReactNode;
};
export const searchEngines: SearchEngineResult[] = [
  {
    label: "Duck Duck Go",
    shortCode: "d?",
    url: (query: string) => `https://duckduckgo.com/?q=${query}`,
    suggestions: (query: string) =>
      `https://ac.duckduckgo.com/ac/?q=${query}&type=list`,
    description: <p>Type d?</p>,
  },
  {
    label: "Google",
    shortCode: "g?",
    url: (query: string) => `https://google.com/search?q=${query}`,
    suggestions: (query: string) =>
      `https://www.google.com/complete/search?client=opera&q=${query}`,
    description: <p>Type g?</p>,
  },
  {
    label: "Stack Overflow",
    shortCode: "so?",
    url: (query: string) => `https://stackoverflow.com/search?q=${query}`,
    description: <p>Type so?</p>,
  },
];

const createWebSearchSource = ({
  query,
}: {
  query: string;
}): AutocompleteSource<SearchEngineResult> => ({
  sourceId: "web-search",
  getItemInputValue({ item }: { item: any }) {
    return item.label;
  },
  getItems() {
    const defaultResults = searchEngines;
    if (query.length === 0) {
      return defaultResults;
    }
    return searchEngines
      .filter(({ shortCode }) => query.startsWith(shortCode))
      .map((se) => {
        const queryNoShortcode = query.replace(se.shortCode, "");
        return {
          ...se,
          queryNoShortcode,
          description: (
            <div>
              Search {se.label} for{" "}
              <code style={{ fontWeight: "bolder" }}>{queryNoShortcode}</code>
            </div>
          ),
        };
      });
  },
  // Run this code when item is selected
  onSelect(params: any) {
    // item is the full item data
    // setQuery is a hook to set the query state
    const { item, setQuery } = params;

    shell.open(item.url(item.queryNoShortcode));
    // invoke(item.action);
    setQuery("");
  },
  // Templates for Header of this source and Items in this source
  templates: {
    header() {
      return <h2>Web Search</h2>;
    },
    item({ item }: { item: any }) {
      return <Action hit={item} />;
    },
  },
});

export default createWebSearchSource;
