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

// packages/editor/src/components/post-publish-panel/maybe-category-panel.js
var maybe_category_panel_exports = {};
__export(maybe_category_panel_exports, {
  default: () => maybe_category_panel_default
});
module.exports = __toCommonJS(maybe_category_panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_hierarchical_term_selector = __toESM(require("../post-taxonomies/hierarchical-term-selector.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function MaybeCategoryPanel() {
  const { hasNoCategory, hasSiteCategories } = (0, import_data.useSelect)((select) => {
    const postType = select(import_store.store).getCurrentPostType();
    const { canUser, getEntityRecord } = select(import_core_data.store);
    const categoriesTaxonomy = getEntityRecord(
      "root",
      "taxonomy",
      "category"
    );
    const defaultCategoryId = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEntityRecord("root", "site")?.default_category : void 0;
    const defaultCategory = defaultCategoryId ? getEntityRecord("taxonomy", "category", defaultCategoryId) : void 0;
    const postTypeSupportsCategories = categoriesTaxonomy && categoriesTaxonomy.types.some((type) => type === postType);
    const categories = categoriesTaxonomy && select(import_store.store).getEditedPostAttribute(
      categoriesTaxonomy.rest_base
    );
    const siteCategories = postTypeSupportsCategories ? !!select(import_core_data.store).getEntityRecords("taxonomy", "category", {
      exclude: [defaultCategoryId],
      per_page: 1
    })?.length : false;
    const noCategory = !!categoriesTaxonomy && !!defaultCategory && postTypeSupportsCategories && (categories?.length === 0 || categories?.length === 1 && defaultCategory?.id === categories[0]);
    return {
      hasNoCategory: noCategory,
      hasSiteCategories: siteCategories
    };
  }, []);
  const [shouldShowPanel, setShouldShowPanel] = (0, import_element.useState)(false);
  (0, import_element.useEffect)(() => {
    if (hasNoCategory) {
      setShouldShowPanel(true);
    }
  }, [hasNoCategory]);
  if (!shouldShowPanel || !hasSiteCategories) {
    return null;
  }
  const panelBodyTitle = [
    (0, import_i18n.__)("Suggestion:"),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-publish-panel__link", children: (0, import_i18n.__)("Assign a category") }, "label")
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.PanelBody, { initialOpen: false, title: panelBodyTitle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)(
      "Categories provide a helpful way to group related posts together and to quickly tell readers what a post is about."
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_hierarchical_term_selector.default, { slug: "category" })
  ] });
}
var maybe_category_panel_default = MaybeCategoryPanel;
//# sourceMappingURL=maybe-category-panel.cjs.map
