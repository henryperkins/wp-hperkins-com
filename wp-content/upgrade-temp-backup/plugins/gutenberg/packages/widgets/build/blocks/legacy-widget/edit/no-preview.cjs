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

// packages/widgets/src/blocks/legacy-widget/edit/no-preview.js
var no_preview_exports = {};
__export(no_preview_exports, {
  default: () => NoPreview
});
module.exports = __toCommonJS(no_preview_exports);
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
function NoPreview({ name }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "wp-block-legacy-widget__edit-no-preview", children: [
    name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: name }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: (0, import_i18n.__)("No preview available.") })
  ] });
}
//# sourceMappingURL=no-preview.cjs.map
