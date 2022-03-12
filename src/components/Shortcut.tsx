import { invoke } from "@tauri-apps/api";
import hotkeys from "hotkeys-js";
import keycode from "keycode";
import { useEffect, useState } from "react";
import { Commands, getConfig } from "../utils";

const Shortcut = () => {
  const [shortcut, setShortcut] = useState<string | undefined>();
  const [editingShortcut, setEditingShortcut] = useState(false);
  const [listenForKeys, setListenForKeys] = useState(false);
  useEffect(() => {
    getConfig().then((data) => setShortcut(data.shortcut));
  }, []);
  useEffect(() => {
    if (listenForKeys) {
      hotkeys("*", () => {
        const currentKeyCodes = hotkeys.getPressedKeyCodes();
        const currentKeyValues = currentKeyCodes.map((k) => {
          let name = keycode(k);
          if (name.includes("command")) {
            return "CMD";
          } else {
            return name;
          }
        });
        setShortcut(currentKeyValues.join(" + "));
      });
    } else {
      hotkeys.unbind();
    }
  }, [listenForKeys]);

  const onSave = () => {
    setListenForKeys(!listenForKeys);
    setEditingShortcut(false);
    invoke(Commands.SetShortcut, { shortcut });
  };
  return (
    <div>
      <p>
        Shortcut: <code>{shortcut}</code>
      </p>
      <div>
        {!editingShortcut && (
          <button
            onClick={() => {
              setListenForKeys(!listenForKeys);
              setEditingShortcut(true);
            }}
          >
            Edit
          </button>
        )}
        {editingShortcut && <p>Begin typing your shortcut commands</p>}
        {editingShortcut && <button onClick={onSave}>Save</button>}
      </div>
    </div>
  );
};

export default Shortcut;
