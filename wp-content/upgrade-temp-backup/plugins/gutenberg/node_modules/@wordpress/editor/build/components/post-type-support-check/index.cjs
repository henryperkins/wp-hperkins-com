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

// packages/editor/src/components/post-type-support-check/index.js
var post_type_support_check_exports = {};
__export(post_type_support_check_exports, {
  default: () => post_type_support_check_default
});
module.exports = __toCommonJS(post_type_support_check_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
function checkSupport(supports = {}, key) {
  if (supports[key] !== void 0) {
    return !!supports[key];
  }
  const [topKey, subKey] = key.split(".");
  const [subProperties] = Array.isArray(supports[topKey]) ? supports[topKey] : [];
  return Array.isArray(subProperties) ? subProperties.includes(subKey) : !!subProperties?.[subKey];
}
function PostTypeSupportCheck({ children, supportKeys }) {
  const postType = (0, import_data.useSelect)((select) => {
    const { getEditedPostAttribute } = select(import_store.store);
    const { getPostType } = select(import_core_data.store);
    return getPostType(getEditedPostAttribute("type"));
  }, []);
  let isSupported = !!postType;
  if (postType) {
    isSupported = (Array.isArray(supportKeys) ? supportKeys : [supportKeys]).some((key) => checkSupport(postType.supports, key));
  }
  if (!isSupported) {
    return null;
  }
  return children;
}
var post_type_support_check_default = PostTypeSupportCheck;
//# sourceMappingURL=index.cjs.map
