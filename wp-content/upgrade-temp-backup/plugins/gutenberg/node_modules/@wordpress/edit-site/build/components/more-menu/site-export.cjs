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

// packages/edit-site/src/components/more-menu/site-export.js
var site_export_exports = {};
__export(site_export_exports, {
  default: () => SiteExport
});
module.exports = __toCommonJS(site_export_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_blob = require("@wordpress/blob");
var import_core_data = require("@wordpress/core-data");
var import_notices = require("@wordpress/notices");
var import_jsx_runtime = require("react/jsx-runtime");
function SiteExport() {
  const canExport = (0, import_data.useSelect)((select) => {
    const targetHints = select(import_core_data.store).getCurrentTheme()?._links?.["wp:export-theme"]?.[0]?.targetHints ?? {};
    return !!targetHints.allow?.includes("GET");
  }, []);
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  if (!canExport) {
    return null;
  }
  async function handleExport() {
    try {
      const response = await (0, import_api_fetch.default)({
        path: "/wp-block-editor/v1/export",
        parse: false,
        headers: {
          Accept: "application/zip"
        }
      });
      const blob = await response.blob();
      const contentDisposition = response.headers.get(
        "content-disposition"
      );
      const contentDispositionMatches = contentDisposition.match(/=(.+)\.zip/);
      const fileName = contentDispositionMatches[1] ? contentDispositionMatches[1] : "edit-site-export";
      (0, import_blob.downloadBlob)(fileName + ".zip", blob, "application/zip");
    } catch (errorResponse) {
      let error = {};
      try {
        error = await errorResponse.json();
      } catch (e) {
      }
      const errorMessage = error.message && error.code !== "unknown_error" ? error.message : (0, import_i18n.__)("An error occurred while creating the site export.");
      createErrorNotice(errorMessage, { type: "snackbar" });
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItem,
    {
      role: "menuitem",
      icon: import_icons.download,
      onClick: handleExport,
      info: (0, import_i18n.__)(
        "Download your theme with updated templates and styles."
      ),
      children: (0, import_i18n._x)("Export", "site exporter menu item")
    }
  );
}
//# sourceMappingURL=site-export.cjs.map
