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

// packages/block-editor/src/components/dimension-control/index.js
var dimension_control_exports = {};
__export(dimension_control_exports, {
  default: () => DimensionControl
});
module.exports = __toCommonJS(dimension_control_exports);
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_use_settings = require("../use-settings/index.cjs");
var import_preset_input_control = __toESM(require("../preset-input-control/index.cjs"));
var import_constants = require("../preset-input-control/constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_ARRAY = [];
var DIMENSION_CUSTOM_VALUE_SETTINGS = {
  ...import_constants.CUSTOM_VALUE_SETTINGS,
  px: { max: 1e3, steps: 1 },
  em: { max: 50, steps: 0.1 },
  rem: { max: 50, steps: 0.1 }
};
function useDimensionSizes(presets) {
  const defaultSizes = presets?.default ?? EMPTY_ARRAY;
  const customSizes = presets?.custom ?? EMPTY_ARRAY;
  const themeSizes = presets?.theme ?? EMPTY_ARRAY;
  return (0, import_element.useMemo)(() => {
    const sizes = [
      { name: (0, import_i18n.__)("None"), slug: "0", size: 0 },
      ...customSizes,
      ...themeSizes,
      ...defaultSizes
    ];
    return sizes;
  }, [customSizes, themeSizes, defaultSizes]);
}
function DimensionControl({
  label = (0, import_i18n.__)("Dimension"),
  onChange,
  value,
  dimensionSizes: dimensionSizesProp
}) {
  const [dimensionSizesFromSettings, availableUnits] = (0, import_use_settings.useSettings)(
    "dimensions.dimensionSizes",
    "spacing.units"
  );
  const dimensionSizes = dimensionSizesProp ?? dimensionSizesFromSettings;
  const units = (0, import_components.__experimentalUseCustomUnits)({
    availableUnits: availableUnits || [
      "%",
      "px",
      "em",
      "rem",
      "vh",
      "vw"
    ]
  });
  const options = useDimensionSizes(dimensionSizes);
  const [selectedUnit, setSelectedUnit] = (0, import_element.useState)(() => {
    const [, unit] = (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(value);
    return unit || units[0]?.value || "px";
  });
  const handleUnitChange = (newUnit) => {
    const [currentValue, currentUnit] = (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(value);
    if (["em", "rem"].includes(newUnit) && currentUnit === "px") {
      onChange((currentValue / 16).toFixed(2) + newUnit);
    } else if (["em", "rem"].includes(currentUnit) && newUnit === "px") {
      onChange(Math.round(currentValue * 16) + newUnit);
    } else if ([
      "%",
      "vw",
      "svw",
      "lvw",
      "dvw",
      "vh",
      "svh",
      "lvh",
      "dvh",
      "vi",
      "svi",
      "lvi",
      "dvi",
      "vb",
      "svb",
      "lvb",
      "dvb",
      "vmin",
      "svmin",
      "lvmin",
      "dvmin",
      "vmax",
      "svmax",
      "lvmax",
      "dvmax"
    ].includes(newUnit) && currentValue > 100) {
      onChange(100 + newUnit);
    }
    setSelectedUnit(newUnit);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { className: "block-editor-dimension-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl.VisualLabel, { as: "legend", children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_preset_input_control.default,
      {
        ariaLabel: label,
        className: "block-editor-dimension-control",
        customValueSettings: DIMENSION_CUSTOM_VALUE_SETTINGS,
        minimumCustomValue: 0,
        onChange,
        onUnitChange: handleUnitChange,
        presets: options,
        presetType: "dimension",
        selectedUnit,
        showTooltip: true,
        units,
        value
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
