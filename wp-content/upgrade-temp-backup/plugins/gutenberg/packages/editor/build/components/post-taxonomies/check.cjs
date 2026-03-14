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

// packages/editor/src/components/post-taxonomies/check.js
var check_exports = {};
__export(check_exports, {
  default: () => PostTaxonomiesCheck
});
module.exports = __toCommonJS(check_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
function PostTaxonomiesCheck({ children }) {
  const hasTaxonomies = (0, import_data.useSelect)((select) => {
    const postType = select(import_store.store).getCurrentPostType();
    const taxonomies = select(import_core_data.store).getEntityRecords(
      "root",
      "taxonomy",
      { per_page: -1 }
    );
    return taxonomies?.some(
      (taxonomy) => taxonomy.types.includes(postType)
    );
  }, []);
  if (!hasTaxonomies) {
    return null;
  }
  return children;
}
//# sourceMappingURL=check.cjs.map
