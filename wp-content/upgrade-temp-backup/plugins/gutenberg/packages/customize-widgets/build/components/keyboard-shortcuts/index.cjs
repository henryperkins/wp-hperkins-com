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

// packages/customize-widgets/src/components/keyboard-shortcuts/index.js
var keyboard_shortcuts_exports = {};
__export(keyboard_shortcuts_exports, {
  default: () => keyboard_shortcuts_default
});
module.exports = __toCommonJS(keyboard_shortcuts_exports);
var import_element = require("@wordpress/element");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_keycodes = require("@wordpress/keycodes");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
function KeyboardShortcuts({ undo, redo, save }) {
  (0, import_keyboard_shortcuts.useShortcut)("core/customize-widgets/undo", (event) => {
    undo();
    event.preventDefault();
  });
  (0, import_keyboard_shortcuts.useShortcut)("core/customize-widgets/redo", (event) => {
    redo();
    event.preventDefault();
  });
  (0, import_keyboard_shortcuts.useShortcut)("core/customize-widgets/save", (event) => {
    event.preventDefault();
    save();
  });
  return null;
}
function KeyboardShortcutsRegister() {
  const { registerShortcut, unregisterShortcut } = (0, import_data.useDispatch)(
    import_keyboard_shortcuts.store
  );
  (0, import_element.useEffect)(() => {
    registerShortcut({
      name: "core/customize-widgets/undo",
      category: "global",
      description: (0, import_i18n.__)("Undo your last changes."),
      keyCombination: {
        modifier: "primary",
        character: "z"
      }
    });
    registerShortcut({
      name: "core/customize-widgets/redo",
      category: "global",
      description: (0, import_i18n.__)("Redo your last undo."),
      keyCombination: {
        modifier: "primaryShift",
        character: "z"
      },
      // Disable on Apple OS because it conflicts with the browser's
      // history shortcut. It's a fine alias for both Windows and Linux.
      // Since there's no conflict for Ctrl+Shift+Z on both Windows and
      // Linux, we keep it as the default for consistency.
      aliases: (0, import_keycodes.isAppleOS)() ? [] : [
        {
          modifier: "primary",
          character: "y"
        }
      ]
    });
    registerShortcut({
      name: "core/customize-widgets/save",
      category: "global",
      description: (0, import_i18n.__)("Save your changes."),
      keyCombination: {
        modifier: "primary",
        character: "s"
      }
    });
    return () => {
      unregisterShortcut("core/customize-widgets/undo");
      unregisterShortcut("core/customize-widgets/redo");
      unregisterShortcut("core/customize-widgets/save");
    };
  }, [registerShortcut]);
  return null;
}
KeyboardShortcuts.Register = KeyboardShortcutsRegister;
var keyboard_shortcuts_default = KeyboardShortcuts;
//# sourceMappingURL=index.cjs.map
