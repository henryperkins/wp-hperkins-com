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

// packages/editor/src/components/character-count/index.js
var character_count_exports = {};
__export(character_count_exports, {
  default: () => CharacterCount
});
module.exports = __toCommonJS(character_count_exports);
var import_data = require("@wordpress/data");
var import_wordcount = require("@wordpress/wordcount");
var import_store = require("../../store/index.cjs");
function CharacterCount() {
  const content = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditedPostAttribute("content"),
    []
  );
  return (0, import_wordcount.count)(content, "characters_including_spaces");
}
//# sourceMappingURL=index.cjs.map
