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

// packages/editor/src/components/post-publish-panel/maybe-tags-panel.js
var maybe_tags_panel_exports = {};
__export(maybe_tags_panel_exports, {
  default: () => maybe_tags_panel_default
});
module.exports = __toCommonJS(maybe_tags_panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_flat_term_selector = __toESM(require("../post-taxonomies/flat-term-selector.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var TagsPanel = () => {
  const tagLabels = (0, import_data.useSelect)((select) => {
    const taxonomy = select(import_core_data.store).getTaxonomy("post_tag");
    return taxonomy?.labels;
  }, []);
  const addNewItem = tagLabels?.add_new_item ?? (0, import_i18n.__)("Add tag");
  const tagLabel = tagLabels?.name ?? (0, import_i18n.__)("Tags");
  const panelBodyTitle = [
    (0, import_i18n.__)("Suggestion:"),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "editor-post-publish-panel__link", children: addNewItem }, "label")
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.PanelBody, { initialOpen: false, title: panelBodyTitle, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.sprintf)(
      // translators: %s is the taxonomy name (e.g., "Tags").
      (0, import_i18n.__)(
        "%s help users and search engines navigate your site and find your content. Add a few keywords to describe your post."
      ),
      tagLabel
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_flat_term_selector.default, { slug: "post_tag" })
  ] });
};
var MaybeTagsPanel = () => {
  const { postHasTags, siteHasTags, isPostTypeSupported } = (0, import_data.useSelect)(
    (select) => {
      const postType = select(import_store.store).getCurrentPostType();
      const tagsTaxonomy = select(import_core_data.store).getEntityRecord(
        "root",
        "taxonomy",
        "post_tag"
      );
      const _isPostTypeSupported = tagsTaxonomy?.types?.includes(postType);
      const areTagsFetched = tagsTaxonomy !== void 0;
      const tags = tagsTaxonomy && select(import_store.store).getEditedPostAttribute(
        tagsTaxonomy.rest_base
      );
      const siteTags = _isPostTypeSupported ? !!select(import_core_data.store).getEntityRecords(
        "taxonomy",
        "post_tag",
        { per_page: 1 }
      )?.length : false;
      return {
        postHasTags: !!tags?.length,
        siteHasTags: siteTags,
        isPostTypeSupported: areTagsFetched && _isPostTypeSupported
      };
    },
    []
  );
  const [hadTagsWhenOpeningThePanel] = (0, import_element.useState)(postHasTags);
  if (!isPostTypeSupported || !siteHasTags) {
    return null;
  }
  if (!hadTagsWhenOpeningThePanel) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TagsPanel, {});
  }
  return null;
};
var maybe_tags_panel_default = MaybeTagsPanel;
//# sourceMappingURL=maybe-tags-panel.cjs.map
