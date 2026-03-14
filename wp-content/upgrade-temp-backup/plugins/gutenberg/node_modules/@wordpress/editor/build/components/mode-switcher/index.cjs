"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/mode-switcher/index.js
var mode_switcher_exports = {};
__export(mode_switcher_exports, {
  default: () => mode_switcher_default
});
module.exports = __toCommonJS(mode_switcher_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var MODES = [
  {
    value: "visual",
    label: (0, import_i18n.__)("Visual editor")
  },
  {
    value: "text",
    label: (0, import_i18n.__)("Code editor")
  }
];
function ModeSwitcher() {
  const { shortcut, isRichEditingEnabled, isCodeEditingEnabled, mode } = (0, import_data.useSelect)(
    (select) => ({
      shortcut: select(
        import_keyboard_shortcuts.store
      ).getShortcutRepresentation("core/editor/toggle-mode"),
      isRichEditingEnabled: select(import_store.store).getEditorSettings().richEditingEnabled,
      isCodeEditingEnabled: select(import_store.store).getEditorSettings().codeEditingEnabled,
      mode: select(import_store.store).getEditorMode()
    }),
    []
  );
  const { switchEditorMode } = (0, import_data.useDispatch)(import_store.store);
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
        info: (0, import_i18n.__)(
          "You can enable the visual editor in your profile settings."
        )
      };
    }
    if (choice.value !== selectedMode && !choice.disabled) {
      return { ...choice, shortcut };
    }
    return choice;
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { label: (0, import_i18n.__)("Editor"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItemsChoice,
    {
      choices,
      value: selectedMode,
      onSelect: switchEditorMode
    }
  ) });
}
var mode_switcher_default = ModeSwitcher;
//# sourceMappingURL=index.cjs.map
