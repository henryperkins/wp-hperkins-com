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

// packages/block-editor/src/components/text-indent-control/index.js
var text_indent_control_exports = {};
__export(text_indent_control_exports, {
  default: () => TextIndentControl
});
module.exports = __toCommonJS(text_indent_control_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_use_settings = require("../use-settings/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function TextIndentControl({
  __next40pxDefaultSize = false,
  value,
  onChange,
  __unstableInputWidth = "60px",
  withSlider = false,
  hasBottomMargin = false,
  help,
  ...otherProps
}) {
  const [availableUnits] = (0, import_use_settings.useSettings)("spacing.units");
  const units = (0, import_components.__experimentalUseCustomUnits)({
    availableUnits: availableUnits || [
      "px",
      "em",
      "rem",
      "ch",
      "%",
      "vw",
      "vh"
    ],
    defaultValues: { px: 16, em: 2, rem: 2, ch: 2 }
  });
  const [valueQuantity, valueUnit] = (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(
    value,
    units
  );
  const isValueUnitRelative = !!valueUnit && ["em", "rem", "%", "ch", "vw", "vh"].includes(valueUnit);
  if (!withSlider) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalUnitControl,
      {
        __next40pxDefaultSize,
        __shouldNotWarnDeprecated36pxSize: true,
        ...otherProps,
        label: (0, import_i18n.__)("Line indent"),
        value,
        __unstableInputWidth,
        units,
        onChange,
        help
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalView, { style: hasBottomMargin ? { marginBottom: 12 } : void 0, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl.VisualLabel, { children: (0, import_i18n.__)("Line indent") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { isBlock: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalUnitControl,
        {
          __next40pxDefaultSize,
          __shouldNotWarnDeprecated36pxSize: true,
          label: (0, import_i18n.__)("Line indent"),
          labelPosition: "top",
          hideLabelFromVision: true,
          value,
          onChange,
          size: otherProps.size,
          units,
          __unstableInputWidth,
          min: 0
        }
      ) }),
      withSlider && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { isBlock: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginX: 2, marginBottom: 0, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.RangeControl,
        {
          __next40pxDefaultSize,
          __shouldNotWarnDeprecated36pxSize: true,
          label: (0, import_i18n.__)("Line indent"),
          hideLabelFromVision: true,
          value: valueQuantity,
          withInputField: false,
          onChange: (newValue) => {
            if (newValue === void 0) {
              onChange?.(void 0);
            } else {
              onChange?.(
                newValue + (valueUnit ?? "px")
              );
            }
          },
          min: 0,
          max: isValueUnitRelative ? 10 : 100,
          step: isValueUnitRelative ? 0.1 : 1,
          initialPosition: 0
        }
      ) }) })
    ] }),
    help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "components-base-control__help", children: help })
  ] });
}
//# sourceMappingURL=index.cjs.map
