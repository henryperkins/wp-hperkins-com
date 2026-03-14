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

// packages/global-styles-ui/src/size-control/index.tsx
var size_control_exports = {};
__export(size_control_exports, {
  SizeControl: () => SizeControl
});
module.exports = __toCommonJS(size_control_exports);
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var DEFAULT_UNITS = ["px", "em", "rem", "vw", "vh"];
function SizeControl(props) {
  const { baseControlProps } = (0, import_components.useBaseControlProps)(props);
  const { value, onChange, fallbackValue, disabled, label } = props;
  const units = (0, import_components.__experimentalUseCustomUnits)({
    availableUnits: DEFAULT_UNITS
  });
  const [valueQuantity, valueUnit = "px"] = (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(value, units);
  const isValueUnitRelative = !!valueUnit && ["em", "rem", "vw", "vh"].includes(valueUnit);
  const handleUnitControlChange = (newValue) => {
    onChange?.(newValue);
  };
  const handleRangeControlChange = (newValue) => {
    if (newValue !== void 0) {
      onChange?.(newValue + valueUnit);
    } else {
      onChange?.(void 0);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl, { ...baseControlProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { isBlock: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalUnitControl,
      {
        __next40pxDefaultSize: true,
        label,
        hideLabelFromVision: true,
        value,
        onChange: handleUnitControlChange,
        units,
        min: 0,
        disabled
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { isBlock: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginX: 2, marginBottom: 0, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.RangeControl,
      {
        __next40pxDefaultSize: true,
        label,
        hideLabelFromVision: true,
        value: valueQuantity,
        initialPosition: fallbackValue,
        withInputField: false,
        onChange: handleRangeControlChange,
        min: 0,
        max: isValueUnitRelative ? 10 : 100,
        step: isValueUnitRelative ? 0.1 : 1,
        disabled
      }
    ) }) })
  ] }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SizeControl
});
//# sourceMappingURL=index.cjs.map
