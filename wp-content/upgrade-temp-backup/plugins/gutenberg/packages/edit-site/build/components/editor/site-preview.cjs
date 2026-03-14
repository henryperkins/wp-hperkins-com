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

// packages/edit-site/src/components/editor/site-preview.js
var site_preview_exports = {};
__export(site_preview_exports, {
  default: () => SitePreview
});
module.exports = __toCommonJS(site_preview_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_dom = require("@wordpress/dom");
var import_url = require("@wordpress/url");
var import_jsx_runtime = require("react/jsx-runtime");
function SitePreview() {
  const siteUrl = (0, import_data.useSelect)((select) => {
    const { getEntityRecord } = select(import_core_data.store);
    const siteData = getEntityRecord("root", "__unstableBase");
    return siteData?.home;
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "iframe",
    {
      src: (0, import_url.addQueryArgs)(siteUrl, {
        // Parameter for hiding the admin bar.
        wp_site_preview: 1
      }),
      title: (0, import_i18n.__)("Site Preview"),
      style: {
        display: "block",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff"
      },
      onLoad: (event) => {
        const document = event.target.contentDocument;
        const focusableElements = import_dom.focus.focusable.find(document);
        focusableElements.forEach((element) => {
          element.style.pointerEvents = "none";
          element.tabIndex = -1;
          element.setAttribute("aria-hidden", "true");
        });
      }
    }
  );
}
//# sourceMappingURL=site-preview.cjs.map
