import { invoke } from "@tauri-apps/api";
import hotkeys from "hotkeys-js";
import keycode from "keycode";
import { useEffect, useState } from "react";
import { Commands, getConfig } from "../utils";
import Button, { ButtonContainer } from "./core/button";

const Shortcut = () => {
  const [shortcut, setShortcut] = useState<string | undefined>();
  const [editingShortcut, setEditingShortcut] = useState(false);
  const [listenForKeys, setListenForKeys] = useState(false);
  useEffect(() => {
    getConfig().then((data) => setShortcut(data.user_config.shortcut));
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
      <h3>Shortcut</h3>
      <p>
        <code>{shortcut}</code>
      </p>
      {editingShortcut && <p>Begin typing your shortcut commands</p>}
      <ButtonContainer>
        {!editingShortcut && (
          <Button
            onClick={() => {
              setListenForKeys(!listenForKeys);
              setEditingShortcut(true);
            }}
          >
            Edit
          </Button>
        )}

        {editingShortcut && (
          <>
            <Button appearance="success" onClick={onSave}>
              Save
            </Button>
            <Button
              appearance="secondary"
              onClick={() => setEditingShortcut(false)}
            >
              Cancel
            </Button>
          </>
        )}
      </ButtonContainer>
    </div>
  );
};

export default Shortcut;
