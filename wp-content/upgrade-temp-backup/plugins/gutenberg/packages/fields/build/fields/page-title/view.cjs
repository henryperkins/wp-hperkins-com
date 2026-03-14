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

// packages/fields/src/fields/page-title/view.tsx
var view_exports = {};
__export(view_exports, {
  default: () => PageTitleView
});
module.exports = __toCommonJS(view_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_view = require("../title/view.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Badge } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function PageTitleView({ item }) {
  const { frontPageId, postsPageId } = (0, import_data.useSelect)((select) => {
    const { getEntityRecord } = select(import_core_data.store);
    const siteSettings = getEntityRecord(
      "root",
      "site"
    );
    return {
      frontPageId: siteSettings?.page_on_front,
      postsPageId: siteSettings?.page_for_posts
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_view.BaseTitleView, { item, className: "fields-field__page-title", children: [frontPageId, postsPageId].includes(item.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: item.id === frontPageId ? (0, import_i18n.__)("Homepage") : (0, import_i18n.__)("Posts Page") }) });
}
//# sourceMappingURL=view.cjs.map
