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

// packages/block-editor/src/components/link-control/is-url-like.js
var is_url_like_exports = {};
__export(is_url_like_exports, {
  default: () => isURLLike,
  isHashLink: () => isHashLink,
  isRelativePath: () => isRelativePath
});
module.exports = __toCommonJS(is_url_like_exports);
var import_url = require("@wordpress/url");
function isHashLink(val) {
  return val?.startsWith("#") && (0, import_url.isValidFragment)(val);
}
function isRelativePath(val) {
  return val?.startsWith("/") || val?.startsWith("./") || val?.startsWith("../");
}
function isURLLike(val) {
  const hasSpaces = val.includes(" ");
  if (hasSpaces) {
    return false;
  }
  const protocol = (0, import_url.getProtocol)(val);
  const protocolIsValid = (0, import_url.isValidProtocol)(protocol);
  const mayBeTLD = hasPossibleTLD(val);
  const isWWW = val?.startsWith("www.");
  return protocolIsValid || isWWW || isHashLink(val) || mayBeTLD || isRelativePath(val);
}
function hasPossibleTLD(url, maxLength = 6) {
  const cleanedURL = url.split(/[?#]/)[0];
  const regex = new RegExp(
    `(?<=\\S)\\.(?:[a-zA-Z_]{2,${maxLength}})(?:\\/|$)`
  );
  return regex.test(cleanedURL);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isHashLink,
  isRelativePath
});
//# sourceMappingURL=is-url-like.cjs.map
