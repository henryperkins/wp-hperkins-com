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

// packages/block-directory/src/components/downloadable-blocks-panel/inserter-panel.js
var inserter_panel_exports = {};
__export(inserter_panel_exports, {
  default: () => inserter_panel_default
});
module.exports = __toCommonJS(inserter_panel_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_a11y = require("@wordpress/a11y");
var import_jsx_runtime = require("react/jsx-runtime");
function DownloadableBlocksInserterPanel({
  children,
  downloadableItems,
  hasLocalBlocks
}) {
  const count = downloadableItems.length;
  (0, import_element.useEffect)(() => {
    (0, import_a11y.speak)(
      (0, import_i18n.sprintf)(
        /* translators: %d: number of available blocks. */
        (0, import_i18n._n)(
          "%d additional block is available to install.",
          "%d additional blocks are available to install.",
          count
        ),
        count
      )
    );
  }, [count]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !hasLocalBlocks && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "block-directory-downloadable-blocks-panel__no-local", children: (0, import_i18n.__)("No results available from your installed blocks.") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-inserter__quick-inserter-separator" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-directory-downloadable-blocks-panel", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-directory-downloadable-blocks-panel__header", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "block-directory-downloadable-blocks-panel__title", children: (0, import_i18n.__)("Available to install") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "block-directory-downloadable-blocks-panel__description", children: (0, import_i18n.__)(
          "Select a block to install and add it to your post."
        ) })
      ] }),
      children
    ] })
  ] });
}
var inserter_panel_default = DownloadableBlocksInserterPanel;
//# sourceMappingURL=inserter-panel.cjs.map
