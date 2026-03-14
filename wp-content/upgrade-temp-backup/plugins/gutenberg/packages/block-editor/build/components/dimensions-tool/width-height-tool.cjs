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

// packages/block-editor/src/components/dimensions-tool/width-height-tool.js
var width_height_tool_exports = {};
__export(width_height_tool_exports, {
  default: () => WidthHeightTool
});
module.exports = __toCommonJS(width_height_tool_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
function WidthHeightTool({
  panelId,
  value = {},
  onChange = () => {
  },
  units,
  isShownByDefault = true
}) {
  const width = value.width === "auto" ? "" : value.width ?? "";
  const height = value.height === "auto" ? "" : value.height ?? "";
  const onDimensionChange = (dimension) => (nextDimension) => {
    const nextValue = { ...value };
    if (!nextDimension) {
      delete nextValue[dimension];
    } else {
      nextValue[dimension] = nextDimension;
    }
    onChange(nextValue);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalToolsPanelItem,
      {
        style: { gridColumn: "span 1" },
        label: (0, import_i18n.__)("Width"),
        isShownByDefault,
        hasValue: () => width !== "",
        onDeselect: onDimensionChange("width"),
        panelId,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalUnitControl,
          {
            label: (0, import_i18n.__)("Width"),
            placeholder: (0, import_i18n.__)("Auto"),
            labelPosition: "top",
            units,
            min: 0,
            value: width,
            onChange: onDimensionChange("width"),
            size: "__unstable-large"
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalToolsPanelItem,
      {
        style: { gridColumn: "span 1" },
        label: (0, import_i18n.__)("Height"),
        isShownByDefault,
        hasValue: () => height !== "",
        onDeselect: onDimensionChange("height"),
        panelId,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalUnitControl,
          {
            label: (0, import_i18n.__)("Height"),
            placeholder: (0, import_i18n.__)("Auto"),
            labelPosition: "top",
            units,
            min: 0,
            value: height,
            onChange: onDimensionChange("height"),
            size: "__unstable-large"
          }
        )
      }
    )
  ] });
}
//# sourceMappingURL=width-height-tool.cjs.map
