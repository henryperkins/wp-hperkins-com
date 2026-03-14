"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/keyboard-shortcut-help-modal/dynamic-shortcut.js
var dynamic_shortcut_exports = {};
__export(dynamic_shortcut_exports, {
  default: () => dynamic_shortcut_default
});
module.exports = __toCommonJS(dynamic_shortcut_exports);
var import_data = require("@wordpress/data");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_shortcut = __toESM(require("./shortcut.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function DynamicShortcut({ name }) {
  const { keyCombination, description, aliases } = (0, import_data.useSelect)(
    (select) => {
      const {
        getShortcutKeyCombination,
        getShortcutDescription,
        getShortcutAliases
      } = select(import_keyboard_shortcuts.store);
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_shortcut.default,
    {
      keyCombination,
      description,
      aliases
    }
  );
}
var dynamic_shortcut_default = DynamicShortcut;
//# sourceMappingURL=dynamic-shortcut.cjs.map
