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

// packages/block-editor/src/store/private-keys.js
var private_keys_exports = {};
__export(private_keys_exports, {
  deviceTypeKey: () => deviceTypeKey,
  getMediaSelectKey: () => getMediaSelectKey,
  globalStylesDataKey: () => globalStylesDataKey,
  globalStylesLinksDataKey: () => globalStylesLinksDataKey,
  isIsolatedEditorKey: () => isIsolatedEditorKey,
  isNavigationOverlayContextKey: () => isNavigationOverlayContextKey,
  mediaEditKey: () => mediaEditKey,
  mediaUploadOnSuccessKey: () => mediaUploadOnSuccessKey,
  reusableBlocksSelectKey: () => reusableBlocksSelectKey,
  sectionRootClientIdKey: () => sectionRootClientIdKey,
  selectBlockPatternsKey: () => selectBlockPatternsKey
});
module.exports = __toCommonJS(private_keys_exports);
var globalStylesDataKey = /* @__PURE__ */ Symbol("globalStylesDataKey");
var globalStylesLinksDataKey = /* @__PURE__ */ Symbol("globalStylesLinks");
var selectBlockPatternsKey = /* @__PURE__ */ Symbol("selectBlockPatternsKey");
var reusableBlocksSelectKey = /* @__PURE__ */ Symbol("reusableBlocksSelect");
var sectionRootClientIdKey = /* @__PURE__ */ Symbol("sectionRootClientIdKey");
var mediaEditKey = /* @__PURE__ */ Symbol("mediaEditKey");
var getMediaSelectKey = /* @__PURE__ */ Symbol("getMediaSelect");
var isIsolatedEditorKey = /* @__PURE__ */ Symbol("isIsolatedEditor");
var deviceTypeKey = /* @__PURE__ */ Symbol("deviceTypeKey");
var isNavigationOverlayContextKey = /* @__PURE__ */ Symbol(
  "isNavigationOverlayContext"
);
var mediaUploadOnSuccessKey = /* @__PURE__ */ Symbol("mediaUploadOnSuccess");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deviceTypeKey,
  getMediaSelectKey,
  globalStylesDataKey,
  globalStylesLinksDataKey,
  isIsolatedEditorKey,
  isNavigationOverlayContextKey,
  mediaEditKey,
  mediaUploadOnSuccessKey,
  reusableBlocksSelectKey,
  sectionRootClientIdKey,
  selectBlockPatternsKey
});
//# sourceMappingURL=private-keys.cjs.map
