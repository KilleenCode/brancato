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
  const handleRunWorkflow = (label: string) => {
    invoke("run_workflow", { label });
  };

  return (
    <div style={{ background: "rgb(0 0 0 / 0%)" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const label = formData.get("omnibar") as string | undefined;
          label && handleRunWorkflow(label);
          setValue("");
        }}
      >
        <input
          name="omnibar"
          id="omnibar"
          className="omnibar"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          list="workflows"
        />
        <datalist id="workflows">
          {suggestions.map((name) => (
            <option value={name} />
          ))}
        </datalist>
      </form>
    </div>
  );
};

export default Omnibar;
