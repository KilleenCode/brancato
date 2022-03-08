import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { getConfig } from "./utils";
const Omnibar = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    async function setStoredConfigChoices() {
      let state = await getConfig();
      setSuggestions(state.workflows.map((wf) => wf.name));
    }
    setStoredConfigChoices();
  }, []);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "rgb(137 55 219 / 65%)",
      }}
    >
      <form>
        <input
          value={value}
          list="workflows"
          onChange={(e) => {
            invoke("run_workflow", { label: e.target.value });
            setValue("");
          }}
        />
        <datalist id="workflows">
          {suggestions.map((name) => (
            <option value={name} />
          ))}
        </datalist>
        <button>go!</button>
      </form>
    </div>
  );
};

export default Omnibar;
