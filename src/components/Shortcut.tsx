import { invoke } from "@tauri-apps/api";
import hotkeys from "hotkeys-js";
import keycode from "keycode";
import { useEffect, useState } from "react";
import { Commands } from "../utils";

const Shortcut = ({
  currentShortcut,
  onUpdate,
}: {
  currentShortcut: string;
  onUpdate: () => void;
}) => {
  const [shortcut, setShortcut] = useState(currentShortcut);
  const [editingShortcut, setEditingShortcut] = useState(false);
  const [listenForKeys, setListenForKeys] = useState(false);

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
    onUpdate();
  };
  return (
    <div>
      <p>
        Shortcut: <code>{shortcut}</code>
      </p>{" "}
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
