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

// packages/editor/src/components/keyboard-shortcut-help-modal/shortcut.js
var shortcut_exports = {};
__export(shortcut_exports, {
  default: () => shortcut_default
});
module.exports = __toCommonJS(shortcut_exports);
var import_element = require("@wordpress/element");
var import_keycodes = require("@wordpress/keycodes");
var import_jsx_runtime = require("react/jsx-runtime");
function KeyCombination({ keyCombination, forceAriaLabel }) {
  const shortcut = keyCombination.modifier ? import_keycodes.displayShortcutList[keyCombination.modifier](
    keyCombination.character
  ) : keyCombination.character;
  const ariaLabel = keyCombination.modifier ? import_keycodes.shortcutAriaLabel[keyCombination.modifier](
    keyCombination.character
  ) : keyCombination.character;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "kbd",
    {
      className: "editor-keyboard-shortcut-help-modal__shortcut-key-combination",
      "aria-label": forceAriaLabel || ariaLabel,
      children: (Array.isArray(shortcut) ? shortcut : [shortcut]).map(
        (character, index) => {
          if (character === "+") {
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.Fragment, { children: character }, index);
          }
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "kbd",
            {
              className: "editor-keyboard-shortcut-help-modal__shortcut-key",
              children: character
            },
            index
          );
        }
      )
    }
  );
}
function Shortcut({ description, keyCombination, aliases = [], ariaLabel }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-keyboard-shortcut-help-modal__shortcut-description", children: description }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-keyboard-shortcut-help-modal__shortcut-term", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        KeyCombination,
        {
          keyCombination,
          forceAriaLabel: ariaLabel
        }
      ),
      aliases.map((alias, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        KeyCombination,
        {
          keyCombination: alias,
          forceAriaLabel: ariaLabel
        },
        index
      ))
    ] })
  ] });
}
var shortcut_default = Shortcut;
//# sourceMappingURL=shortcut.cjs.map
