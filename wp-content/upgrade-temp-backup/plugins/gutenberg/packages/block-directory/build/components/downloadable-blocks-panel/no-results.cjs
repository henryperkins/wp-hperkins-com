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

// packages/block-directory/src/components/downloadable-blocks-panel/no-results.js
var no_results_exports = {};
__export(no_results_exports, {
  default: () => no_results_default
});
module.exports = __toCommonJS(no_results_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function DownloadableBlocksNoResults() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-inserter__no-results", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)("No results found.") }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-inserter__tips", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Tip, { children: [
      (0, import_i18n.__)("Interested in creating your own block?"),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.ExternalLink, { href: "https://developer.wordpress.org/block-editor/", children: [
        (0, import_i18n.__)("Get started here"),
        "."
      ] })
    ] }) })
  ] });
}
var no_results_default = DownloadableBlocksNoResults;
//# sourceMappingURL=no-results.cjs.map
