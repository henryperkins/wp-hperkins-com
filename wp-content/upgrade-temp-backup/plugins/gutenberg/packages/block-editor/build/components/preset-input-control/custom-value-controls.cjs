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

// packages/block-editor/src/components/preset-input-control/custom-value-controls.js
var custom_value_controls_exports = {};
__export(custom_value_controls_exports, {
  default: () => CustomValueControls
});
module.exports = __toCommonJS(custom_value_controls_exports);
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function CustomValueControls({
  allowNegativeOnDrag,
  ariaLabel,
  allPlaceholder,
  minValue,
  parsedQuantity,
  computedUnit,
  units,
  isMixed,
  step,
  max,
  showTooltip,
  value,
  minimumCustomValue,
  onCustomValueChange,
  onCustomValueSliderChange,
  onUnitChange,
  onMouseOut,
  onMouseOver,
  setMinValue
}) {
  const unitControl = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalUnitControl,
    {
      className: "preset-input-control__unit-control",
      disableUnits: isMixed,
      hideLabelFromVision: true,
      label: ariaLabel,
      min: minValue,
      onChange: onCustomValueChange,
      onUnitChange,
      onBlur: onMouseOut,
      onFocus: onMouseOver,
      onMouseOut,
      onMouseOver,
      size: "__unstable-large",
      units,
      value: [parsedQuantity, computedUnit].join(""),
      placeholder: allPlaceholder,
      onDragStart: () => {
        if (allowNegativeOnDrag && value?.charAt(0) === "-") {
          setMinValue(0);
        }
      },
      onDrag: () => {
        if (allowNegativeOnDrag && value?.charAt(0) === "-") {
          setMinValue(0);
        }
      },
      onDragEnd: () => {
        if (allowNegativeOnDrag) {
          setMinValue(minimumCustomValue);
        }
      }
    }
  );
  const wrappedUnitControl = showTooltip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Tooltip, { text: ariaLabel, placement: "top", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "preset-input-control__tooltip-wrapper", children: unitControl }) }) : unitControl;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    wrappedUnitControl,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.RangeControl,
      {
        className: "preset-input-control__custom-value-range",
        hideLabelFromVision: true,
        initialPosition: 0,
        label: ariaLabel,
        max,
        min: 0,
        onBlur: onMouseOut,
        onChange: onCustomValueSliderChange,
        onFocus: onMouseOver,
        onMouseOut,
        onMouseOver,
        step,
        value: parsedQuantity,
        withInputField: false,
        __next40pxDefaultSize: true
      }
    )
  ] });
}
//# sourceMappingURL=custom-value-controls.cjs.map
