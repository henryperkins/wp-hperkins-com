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

// packages/editor/src/components/keyboard-shortcut-help-modal/config.js
var config_exports = {};
__export(config_exports, {
  textFormattingShortcuts: () => textFormattingShortcuts
});
module.exports = __toCommonJS(config_exports);
var import_i18n = require("@wordpress/i18n");
var textFormattingShortcuts = [
  {
    keyCombination: { modifier: "primary", character: "b" },
    description: (0, import_i18n.__)("Make the selected text bold.")
  },
  {
    keyCombination: { modifier: "primary", character: "i" },
    description: (0, import_i18n.__)("Make the selected text italic.")
  },
  {
    keyCombination: { modifier: "primary", character: "k" },
    description: (0, import_i18n.__)("Convert the selected text into a link.")
  },
  {
    keyCombination: { modifier: "primaryShift", character: "k" },
    description: (0, import_i18n.__)("Remove a link.")
  },
  {
    keyCombination: { character: "[[" },
    description: (0, import_i18n.__)("Insert a link to a post or page.")
  },
  {
    keyCombination: { modifier: "primary", character: "u" },
    description: (0, import_i18n.__)("Underline the selected text.")
  },
  {
    keyCombination: { modifier: "access", character: "d" },
    description: (0, import_i18n.__)("Strikethrough the selected text.")
  },
  {
    keyCombination: { modifier: "access", character: "x" },
    description: (0, import_i18n.__)("Make the selected text inline code.")
  },
  {
    keyCombination: {
      modifier: "access",
      character: "0"
    },
    aliases: [
      {
        modifier: "access",
        character: "7"
      }
    ],
    description: (0, import_i18n.__)("Convert the current heading to a paragraph.")
  },
  {
    keyCombination: { modifier: "access", character: "1-6" },
    description: (0, import_i18n.__)(
      "Convert the current paragraph or heading to a heading of level 1 to 6."
    )
  },
  {
    keyCombination: { modifier: "primaryShift", character: "SPACE" },
    description: (0, import_i18n.__)("Add non breaking space.")
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  textFormattingShortcuts
});
//# sourceMappingURL=config.cjs.map
