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

// packages/editor/src/components/post-view-link/index.js
var post_view_link_exports = {};
__export(post_view_link_exports, {
  default: () => PostViewLink
});
module.exports = __toCommonJS(post_view_link_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function PostViewLink() {
  const { hasLoaded, permalink, isPublished, label, showIconLabels } = (0, import_data.useSelect)((select) => {
    const postTypeSlug = select(import_store.store).getCurrentPostType();
    const postType = select(import_core_data.store).getPostType(postTypeSlug);
    const { get } = select(import_preferences.store);
    return {
      permalink: select(import_store.store).getPermalink(),
      isPublished: select(import_store.store).isCurrentPostPublished(),
      label: postType?.labels.view_item,
      hasLoaded: !!postType,
      showIconLabels: get("core", "showIconLabels")
    };
  }, []);
  if (!isPublished || !permalink || !hasLoaded) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Button,
    {
      icon: import_icons.external,
      label: label || (0, import_i18n.__)("View post"),
      href: permalink,
      target: "_blank",
      showTooltip: !showIconLabels,
      size: "compact"
    }
  );
}
//# sourceMappingURL=index.cjs.map
