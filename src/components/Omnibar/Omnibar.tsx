import { appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";
import { AppEvents } from "../../utils";
import createWorkflowSource from "./workflow-source";
import createSettingsSource from "./settings-source";
import createWebSearchSource, { searchEngines } from "./websearch-source";
import mexp from "math-expression-evaluator";
import createCalculatorSource from "./math-source";
import { UnlistenFn } from "@tauri-apps/api/event";
import "@algolia/autocomplete-theme-classic";

import NewAutocomplete from "../NewAutocomplete";

const focusSearchBar = () => {
  let input = document.querySelector<HTMLInputElement>(".aa-Input");
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
const Omnibar = () => {
  useEffect(() => {
    const getWindowEvents = async () => [
      await appWindow.listen(AppEvents.OmnibarFocused, focusSearchBar),
    ];

    let unlistens: UnlistenFn[];
    getWindowEvents().then((res) => (unlistens = res));

    return () => {
      unlistens.forEach((unlisten) => unlisten());
    };
  }, []);

  return (
    <div
      style={{
        background: "rgb(0 0 0 / 0%)",
      }}
    >
      <NewAutocomplete getSources={getSources} />
    </div>
  );
};

export const getSources = ({
  query,
  refresh,
}: {
  query: string;
  refresh: () => void;
}) => {
  const searchEngineCodes = searchEngines.map((se) => se.shortCode);
  const isWebSearch =
    query.includes("?") &&
    searchEngineCodes.some((v: string) => query.includes(v));
  let isMath;

  try {
    isMath = mexp.eval(query);
  } catch (e) { }

  if (isMath) {
    return [createCalculatorSource({ query, calculated: isMath, refresh })];
  }

  const pattern = getQueryPattern(query);
  const webSearchSource = createWebSearchSource({ query });
  const defaultSources = [
    createWorkflowSource({ pattern }),
    createSettingsSource({ pattern }),
    webSearchSource,
  ];

  if (isWebSearch) {
    return [webSearchSource];
  }

  return defaultSources;
};

export default Omnibar;
