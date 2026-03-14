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

// packages/block-editor/src/components/link-control/constants.js
var constants_exports = {};
__export(constants_exports, {
  CREATE_TYPE: () => CREATE_TYPE,
  DEFAULT_LINK_SETTINGS: () => DEFAULT_LINK_SETTINGS,
  INTERNAL_TYPE: () => INTERNAL_TYPE,
  LINK_ENTRY_TYPES: () => LINK_ENTRY_TYPES,
  MAILTO_TYPE: () => MAILTO_TYPE,
  TEL_TYPE: () => TEL_TYPE,
  URL_TYPE: () => URL_TYPE
});
module.exports = __toCommonJS(constants_exports);
var import_i18n = require("@wordpress/i18n");
var CREATE_TYPE = "__CREATE__";
var TEL_TYPE = "tel";
var URL_TYPE = "link";
var MAILTO_TYPE = "mailto";
var INTERNAL_TYPE = "internal";
var LINK_ENTRY_TYPES = [
  URL_TYPE,
  MAILTO_TYPE,
  TEL_TYPE,
  INTERNAL_TYPE
];
var DEFAULT_LINK_SETTINGS = [
  {
    id: "opensInNewTab",
    title: (0, import_i18n.__)("Open in new tab")
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CREATE_TYPE,
  DEFAULT_LINK_SETTINGS,
  INTERNAL_TYPE,
  LINK_ENTRY_TYPES,
  MAILTO_TYPE,
  TEL_TYPE,
  URL_TYPE
});
//# sourceMappingURL=constants.cjs.map
