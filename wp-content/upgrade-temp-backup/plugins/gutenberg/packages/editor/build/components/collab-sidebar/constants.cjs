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

// packages/editor/src/components/collab-sidebar/constants.js
var constants_exports = {};
__export(constants_exports, {
  ALL_NOTES_SIDEBAR: () => ALL_NOTES_SIDEBAR,
  FLOATING_NOTES_SIDEBAR: () => FLOATING_NOTES_SIDEBAR,
  SIDEBARS: () => SIDEBARS
});
module.exports = __toCommonJS(constants_exports);
var ALL_NOTES_SIDEBAR = "edit-post/collab-history-sidebar";
var FLOATING_NOTES_SIDEBAR = "edit-post/collab-sidebar";
var SIDEBARS = [ALL_NOTES_SIDEBAR, FLOATING_NOTES_SIDEBAR];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ALL_NOTES_SIDEBAR,
  FLOATING_NOTES_SIDEBAR,
  SIDEBARS
});
//# sourceMappingURL=constants.cjs.map
