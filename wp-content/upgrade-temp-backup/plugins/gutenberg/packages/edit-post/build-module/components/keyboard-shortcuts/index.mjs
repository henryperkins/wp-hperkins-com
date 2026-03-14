// packages/edit-post/src/components/keyboard-shortcuts/index.js
import { useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";
import {
  useShortcut,
  store as keyboardShortcutsStore
} from "@wordpress/keyboard-shortcuts";
import { __ } from "@wordpress/i18n";
import { store as editPostStore } from "../../store/index.mjs";
function KeyboardShortcuts() {
  const { toggleFullscreenMode } = useDispatch(editPostStore);
  const { registerShortcut } = useDispatch(keyboardShortcutsStore);
  useEffect(() => {
    registerShortcut({
      name: "core/edit-post/toggle-fullscreen",
      category: "global",
      description: __("Enable or disable fullscreen mode."),
      keyCombination: {
        modifier: "secondary",
        character: "f"
      }
    });
  }, []);
  useShortcut("core/edit-post/toggle-fullscreen", () => {
    toggleFullscreenMode();
  });
  return null;
}
var keyboard_shortcuts_default = KeyboardShortcuts;
export {
  keyboard_shortcuts_default as default
};
//# sourceMappingURL=index.mjs.map
