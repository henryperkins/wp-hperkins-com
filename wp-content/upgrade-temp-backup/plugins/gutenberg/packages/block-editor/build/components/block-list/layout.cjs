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

// packages/block-editor/src/components/block-list/layout.js
var layout_exports = {};
__export(layout_exports, {
  LayoutProvider: () => LayoutProvider,
  LayoutStyle: () => LayoutStyle,
  defaultLayout: () => defaultLayout,
  useLayout: () => useLayout
});
module.exports = __toCommonJS(layout_exports);
var import_element = require("@wordpress/element");
var import_layouts = require("../../layouts/index.cjs");
var import_use_settings = require("../use-settings/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var defaultLayout = { type: "default" };
var Layout = (0, import_element.createContext)(defaultLayout);
Layout.displayName = "BlockLayoutContext";
var LayoutProvider = Layout.Provider;
function useLayout() {
  return (0, import_element.useContext)(Layout);
}
function LayoutStyle({ layout = {}, css, ...props }) {
  const layoutType = (0, import_layouts.getLayoutType)(layout.type);
  const [blockGapSupport] = (0, import_use_settings.useSettings)("spacing.blockGap");
  const hasBlockGapSupport = blockGapSupport !== null;
  if (layoutType) {
    if (css) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: css });
    }
    const layoutStyle = layoutType.getLayoutStyle?.({
      hasBlockGapSupport,
      layout,
      ...props
    });
    if (layoutStyle) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: layoutStyle });
    }
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LayoutProvider,
  LayoutStyle,
  defaultLayout,
  useLayout
});
//# sourceMappingURL=layout.cjs.map
