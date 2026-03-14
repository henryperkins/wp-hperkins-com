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

// packages/block-editor/src/components/link-control/normalize-url.js
var normalize_url_exports = {};
__export(normalize_url_exports, {
  default: () => normalizeUrl
});
module.exports = __toCommonJS(normalize_url_exports);
var import_url = require("@wordpress/url");
var import_is_url_like = require("./is-url-like.cjs");
var import_constants = require("./constants.cjs");
function normalizeUrl(url) {
  const trimmedUrl = url?.trim();
  if (!trimmedUrl) {
    return { url: trimmedUrl, type: import_constants.URL_TYPE };
  }
  let type = import_constants.URL_TYPE;
  const protocol = (0, import_url.getProtocol)(trimmedUrl) || "";
  if (protocol.includes("mailto")) {
    type = import_constants.MAILTO_TYPE;
  } else if (protocol.includes("tel")) {
    type = import_constants.TEL_TYPE;
  } else if (trimmedUrl?.startsWith("#")) {
    type = import_constants.INTERNAL_TYPE;
  }
  if ((0, import_is_url_like.isHashLink)(trimmedUrl) || (0, import_is_url_like.isRelativePath)(trimmedUrl) || trimmedUrl.startsWith("?") || protocol) {
    return { url: trimmedUrl, type };
  }
  return { url: (0, import_url.prependHTTPS)(trimmedUrl), type };
}
//# sourceMappingURL=normalize-url.cjs.map
