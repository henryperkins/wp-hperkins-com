// packages/editor/src/components/keyboard-shortcut-help-modal/dynamic-shortcut.js
import { useSelect } from "@wordpress/data";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import Shortcut from "./shortcut.mjs";
import { jsx } from "react/jsx-runtime";
function DynamicShortcut({ name }) {
  const { keyCombination, description, aliases } = useSelect(
    (select) => {
      const {
        getShortcutKeyCombination,
        getShortcutDescription,
        getShortcutAliases
      } = select(keyboardShortcutsStore);
      return {
        keyCombination: getShortcutKeyCombination(name),
        aliases: getShortcutAliases(name),
        description: getShortcutDescription(name)
      };
    },
    [name]
  );
  if (!keyCombination) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Shortcut,
    {
      keyCombination,
      description,
      aliases
    }
  );
}
var dynamic_shortcut_default = DynamicShortcut;
export {
  dynamic_shortcut_default as default
};
//# sourceMappingURL=dynamic-shortcut.mjs.map
