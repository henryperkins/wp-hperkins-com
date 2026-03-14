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

// packages/global-styles-ui/src/font-library/api.ts
var api_exports = {};
__export(api_exports, {
  fetchInstallFontFace: () => fetchInstallFontFace,
  fetchInstallFontFamily: () => fetchInstallFontFamily
});
module.exports = __toCommonJS(api_exports);
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_core_data = require("@wordpress/core-data");
var FONT_FAMILIES_URL = "/wp/v2/font-families";
function invalidateFontFamilyCache(registry) {
  const { receiveEntityRecords } = registry.dispatch(import_core_data.store);
  receiveEntityRecords(
    "postType",
    "wp_font_family",
    [],
    void 0,
    true
    // invalidateCache
  );
}
async function fetchInstallFontFamily(data, registry) {
  const config = {
    path: FONT_FAMILIES_URL,
    method: "POST",
    body: data
  };
  const response = await (0, import_api_fetch.default)(config);
  invalidateFontFamilyCache(registry);
  return {
    id: response.id,
    ...response.font_family_settings,
    fontFace: []
  };
}
async function fetchInstallFontFace(fontFamilyId, data, registry) {
  const config = {
    path: `${FONT_FAMILIES_URL}/${fontFamilyId}/font-faces`,
    method: "POST",
    body: data
  };
  const response = await (0, import_api_fetch.default)(config);
  invalidateFontFamilyCache(registry);
  return {
    id: response.id,
    ...response.font_face_settings
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fetchInstallFontFace,
  fetchInstallFontFamily
});
//# sourceMappingURL=api.cjs.map
