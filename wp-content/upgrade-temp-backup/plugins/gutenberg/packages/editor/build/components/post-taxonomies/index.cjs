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

// packages/editor/src/components/post-taxonomies/index.js
var post_taxonomies_exports = {};
__export(post_taxonomies_exports, {
  PostTaxonomies: () => PostTaxonomies,
  default: () => post_taxonomies_default
});
module.exports = __toCommonJS(post_taxonomies_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_hierarchical_term_selector = __toESM(require("./hierarchical-term-selector.cjs"));
var import_flat_term_selector = __toESM(require("./flat-term-selector.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var identity = (x) => x;
function PostTaxonomies({ taxonomyWrapper = identity }) {
  const { postType, taxonomies } = (0, import_data.useSelect)((select) => {
    return {
      postType: select(import_store.store).getCurrentPostType(),
      taxonomies: select(import_core_data.store).getEntityRecords(
        "root",
        "taxonomy",
        { per_page: -1 }
      )
    };
  }, []);
  const visibleTaxonomies = (taxonomies ?? []).filter(
    (taxonomy) => (
      // In some circumstances .visibility can end up as undefined so optional chaining operator required.
      // https://github.com/WordPress/gutenberg/issues/40326
      taxonomy.types.includes(postType) && taxonomy.visibility?.show_ui
    )
  );
  return visibleTaxonomies.map((taxonomy) => {
    const TaxonomyComponent = taxonomy.hierarchical ? import_hierarchical_term_selector.default : import_flat_term_selector.default;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_element.Fragment, { children: taxonomyWrapper(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaxonomyComponent, { slug: taxonomy.slug }),
      taxonomy
    ) }, `taxonomy-${taxonomy.slug}`);
  });
}
var post_taxonomies_default = PostTaxonomies;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PostTaxonomies
});
//# sourceMappingURL=index.cjs.map
