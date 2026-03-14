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

// packages/editor/src/components/post-visibility/label.js
var label_exports = {};
__export(label_exports, {
  default: () => PostVisibilityLabel,
  usePostVisibilityLabel: () => usePostVisibilityLabel
});
module.exports = __toCommonJS(label_exports);
var import_data = require("@wordpress/data");
var import_utils = require("./utils.cjs");
var import_store = require("../../store/index.cjs");
function PostVisibilityLabel() {
  return usePostVisibilityLabel();
}
function usePostVisibilityLabel() {
  const visibility = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditedPostVisibility(),
    []
  );
  return import_utils.VISIBILITY_OPTIONS.find((option) => option.value === visibility)?.label;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usePostVisibilityLabel
});
//# sourceMappingURL=label.cjs.map
