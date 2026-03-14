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

// packages/editor/src/components/global-keyboard-shortcuts/register-shortcuts.js
var register_shortcuts_exports = {};
__export(register_shortcuts_exports, {
  default: () => register_shortcuts_default
});
module.exports = __toCommonJS(register_shortcuts_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_keycodes = require("@wordpress/keycodes");
var import_jsx_runtime = require("react/jsx-runtime");
function EditorKeyboardShortcutsRegister() {
  const { registerShortcut } = (0, import_data.useDispatch)(import_keyboard_shortcuts.store);
  (0, import_element.useEffect)(() => {
    registerShortcut({
      name: "core/editor/toggle-mode",
      category: "global",
      description: (0, import_i18n.__)("Switch between visual editor and code editor."),
      keyCombination: {
        modifier: "secondary",
        character: "m"
      }
    });
    registerShortcut({
      name: "core/editor/save",
      category: "global",
      description: (0, import_i18n.__)("Save your changes."),
      keyCombination: {
        modifier: "primary",
        character: "s"
      }
    });
    registerShortcut({
      name: "core/editor/undo",
      category: "global",
      description: (0, import_i18n.__)("Undo your last changes."),
      keyCombination: {
        modifier: "primary",
        character: "z"
      }
    });
    registerShortcut({
      name: "core/editor/redo",
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
      name: "core/editor/toggle-list-view",
      category: "global",
      description: (0, import_i18n.__)("Show or hide the List View."),
      keyCombination: {
        modifier: "access",
        character: "o"
      }
    });
    registerShortcut({
      name: "core/editor/toggle-distraction-free",
      category: "global",
      description: (0, import_i18n.__)("Enter or exit distraction free mode."),
      keyCombination: {
        modifier: "primaryShift",
        character: "\\"
      }
    });
    registerShortcut({
      name: "core/editor/toggle-sidebar",
      category: "global",
      description: (0, import_i18n.__)("Show or hide the Settings panel."),
      keyCombination: {
        modifier: "primaryShift",
        character: ","
      }
    });
    registerShortcut({
      name: "core/editor/keyboard-shortcuts",
      category: "main",
      description: (0, import_i18n.__)("Display these keyboard shortcuts."),
      keyCombination: {
        modifier: "access",
        character: "h"
      }
    });
    registerShortcut({
      name: "core/editor/new-note",
      category: "block",
      description: (0, import_i18n.__)("Add a new note."),
      keyCombination: {
        modifier: "primaryAlt",
        character: "m"
      }
    });
    registerShortcut({
      name: "core/editor/next-region",
      category: "global",
      description: (0, import_i18n.__)("Navigate to the next part of the editor."),
      keyCombination: {
        modifier: "ctrl",
        character: "`"
      },
      aliases: [
        {
          modifier: "access",
          character: "n"
        }
      ]
    });
    registerShortcut({
      name: "core/editor/previous-region",
      category: "global",
      description: (0, import_i18n.__)("Navigate to the previous part of the editor."),
      keyCombination: {
        modifier: "ctrlShift",
        character: "`"
      },
      aliases: [
        {
          modifier: "access",
          character: "p"
        },
        {
          modifier: "ctrlShift",
          character: "~"
        }
      ]
    });
  }, [registerShortcut]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockEditorKeyboardShortcuts.Register, {});
}
var register_shortcuts_default = EditorKeyboardShortcutsRegister;
//# sourceMappingURL=register-shortcuts.cjs.map
