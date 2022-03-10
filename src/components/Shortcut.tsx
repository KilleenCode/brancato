import hotkeys from "hotkeys-js";
import keycode from "keycode";
import { useEffect, useState } from "react";
const DEFAULT_SHORCUT = "alt+m";

const updateOmnibarShortcut = () => {
    
};
const Shortcut = () => {
  const [shortcut, setShortcut] = useState(DEFAULT_SHORCUT);
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
        setShortcut(currentKeyValues.join("+"));
      });
    } else {
      hotkeys.unbind();
    }
  }, [listenForKeys]);

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
        {editingShortcut && (
          <button
            onClick={() => {
              setListenForKeys(!listenForKeys);
              setEditingShortcut(false);
            }}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Shortcut;
