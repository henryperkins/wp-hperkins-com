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

// packages/editor/src/utils/get-item-title.js
var get_item_title_exports = {};
__export(get_item_title_exports, {
  getItemTitle: () => getItemTitle
});
module.exports = __toCommonJS(get_item_title_exports);
var import_html_entities = require("@wordpress/html-entities");
function getItemTitle(item) {
  if (typeof item.title === "string") {
    return (0, import_html_entities.decodeEntities)(item.title);
  }
  if (item.title && "rendered" in item.title) {
    return (0, import_html_entities.decodeEntities)(item.title.rendered);
  }
  if (item.title && "raw" in item.title) {
    return (0, import_html_entities.decodeEntities)(item.title.raw);
  }
  return "";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getItemTitle
});
//# sourceMappingURL=get-item-title.cjs.map
