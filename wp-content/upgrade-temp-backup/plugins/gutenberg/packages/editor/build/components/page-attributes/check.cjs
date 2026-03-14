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

// packages/editor/src/components/page-attributes/check.js
var check_exports = {};
__export(check_exports, {
  PageAttributesCheck: () => PageAttributesCheck,
  default: () => check_default
});
module.exports = __toCommonJS(check_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
function PageAttributesCheck({ children }) {
  const supportsPageAttributes = (0, import_data.useSelect)((select) => {
    const { getEditedPostAttribute } = select(import_store.store);
    const { getPostType } = select(import_core_data.store);
    const postType = getPostType(getEditedPostAttribute("type"));
    return !!postType?.supports?.["page-attributes"];
  }, []);
  if (!supportsPageAttributes) {
    return null;
  }
  return children;
}
var check_default = PageAttributesCheck;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PageAttributesCheck
});
//# sourceMappingURL=check.cjs.map
