// packages/editor/src/components/mode-switcher/index.js
import { __ } from "@wordpress/i18n";
import { MenuItemsChoice, MenuGroup } from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as keyboardShortcutsStore } from "@wordpress/keyboard-shortcuts";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var MODES = [
  {
    value: "visual",
    label: __("Visual editor")
  },
  {
    value: "text",
    label: __("Code editor")
  }
];
function ModeSwitcher() {
  const { shortcut, isRichEditingEnabled, isCodeEditingEnabled, mode } = useSelect(
    (select) => ({
      shortcut: select(
        keyboardShortcutsStore
      ).getShortcutRepresentation("core/editor/toggle-mode"),
      isRichEditingEnabled: select(editorStore).getEditorSettings().richEditingEnabled,
      isCodeEditingEnabled: select(editorStore).getEditorSettings().codeEditingEnabled,
      mode: select(editorStore).getEditorMode()
    }),
    []
  );
  const { switchEditorMode } = useDispatch(editorStore);
  let selectedMode = mode;
  if (!isRichEditingEnabled && mode === "visual") {
    selectedMode = "text";
  }
  if (!isCodeEditingEnabled && mode === "text") {
    selectedMode = "visual";
  }
  const choices = MODES.map((choice) => {
    if (!isCodeEditingEnabled && choice.value === "text") {
      choice = {
        ...choice,
        disabled: true
      };
    }
    if (!isRichEditingEnabled && choice.value === "visual") {
      choice = {
        ...choice,
        disabled: true,
        info: __(
          "You can enable the visual editor in your profile settings."
        )
      };
    }
    if (choice.value !== selectedMode && !choice.disabled) {
      return { ...choice, shortcut };
    }
    return choice;
  });
  return /* @__PURE__ */ jsx(MenuGroup, { label: __("Editor"), children: /* @__PURE__ */ jsx(
    MenuItemsChoice,
    {
      choices,
      value: selectedMode,
      onSelect: switchEditorMode
    }
  ) });
}
var mode_switcher_default = ModeSwitcher;
export {
  mode_switcher_default as default
};
//# sourceMappingURL=index.mjs.map
