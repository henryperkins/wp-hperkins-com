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

// packages/block-editor/src/components/border-radius-control/index.js
var border_radius_control_exports = {};
__export(border_radius_control_exports, {
  default: () => BorderRadiusControl
});
module.exports = __toCommonJS(border_radius_control_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_linked_button = __toESM(require("./linked-button.cjs"));
var import_use_settings = require("../use-settings/index.cjs");
var import_utils = require("./utils.cjs");
var import_preset_input_control = __toESM(require("../preset-input-control/index.cjs"));
var import_constants = require("./constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function useBorderRadiusSizes(presets) {
  const defaultSizes = presets?.default ?? import_constants.EMPTY_ARRAY;
  const customSizes = presets?.custom ?? import_constants.EMPTY_ARRAY;
  const themeSizes = presets?.theme ?? import_constants.EMPTY_ARRAY;
  return (0, import_element.useMemo)(() => {
    const sizes = [
      { name: (0, import_i18n.__)("None"), slug: "0", size: 0 },
      ...customSizes,
      ...themeSizes,
      ...defaultSizes
    ];
    return sizes.length > import_constants.RANGE_CONTROL_MAX_SIZE ? [
      {
        name: (0, import_i18n.__)("Default"),
        slug: "default",
        size: void 0
      },
      ...sizes
    ] : sizes;
  }, [customSizes, themeSizes, defaultSizes]);
}
function getCornerValue(values, corner) {
  if (corner === "all") {
    return (0, import_utils.getAllValue)(values);
  }
  if (typeof values === "string") {
    return values;
  }
  return values?.[corner];
}
function getCornerUnit(selectedUnits, corner) {
  if (corner === "all") {
    return selectedUnits.flat;
  }
  return selectedUnits[corner];
}
function createCornerChangeHandler(corner, values, onChange) {
  return (newValue) => {
    if (corner === "all") {
      onChange({
        topLeft: newValue,
        topRight: newValue,
        bottomLeft: newValue,
        bottomRight: newValue
      });
    } else {
      const currentValues = typeof values !== "string" ? values || {} : {
        topLeft: values,
        topRight: values,
        bottomLeft: values,
        bottomRight: values
      };
      onChange({
        ...currentValues,
        [corner]: newValue
      });
    }
  };
}
function createCornerUnitChangeHandler(corner, selectedUnits, setSelectedUnits) {
  return (newUnit) => {
    const newUnits = { ...selectedUnits };
    if (corner === "all") {
      newUnits.flat = newUnit;
      newUnits.topLeft = newUnit;
      newUnits.topRight = newUnit;
      newUnits.bottomLeft = newUnit;
      newUnits.bottomRight = newUnit;
    } else {
      newUnits[corner] = newUnit;
    }
    setSelectedUnits(newUnits);
  };
}
function BorderRadiusControl({ onChange, values, presets }) {
  const [isLinked, setIsLinked] = (0, import_element.useState)(
    !(0, import_utils.hasDefinedValues)(values) || !(0, import_utils.hasMixedValues)(values)
  );
  const options = useBorderRadiusSizes(presets);
  const [selectedUnits, setSelectedUnits] = (0, import_element.useState)({
    flat: typeof values === "string" ? (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(values)[1] : void 0,
    topLeft: (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(values?.topLeft)[1],
    topRight: (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(values?.topRight)[1],
    bottomLeft: (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(values?.bottomLeft)[1],
    bottomRight: (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(
      values?.bottomRight
    )[1]
  });
  const [availableUnits] = (0, import_use_settings.useSettings)("spacing.units");
  const units = (0, import_components.__experimentalUseCustomUnits)({
    availableUnits: availableUnits || ["px", "em", "rem"]
  });
  const toggleLinked = () => setIsLinked(!isLinked);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { className: "components-border-radius-control", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { className: "components-border-radius-control__header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.BaseControl.VisualLabel, { as: "legend", children: (0, import_i18n.__)("Radius") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_linked_button.default, { onClick: toggleLinked, isLinked })
    ] }),
    isLinked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_preset_input_control.default,
      {
        ariaLabel: import_constants.CORNERS.all,
        className: "components-border-radius-control",
        icon: import_constants.ICONS.all,
        minimumCustomValue: import_constants.MIN_BORDER_RADIUS_VALUE,
        onChange: createCornerChangeHandler(
          "all",
          values,
          onChange
        ),
        onUnitChange: createCornerUnitChangeHandler(
          "all",
          selectedUnits,
          setSelectedUnits
        ),
        presets: options,
        presetType: "border-radius",
        selectedUnit: getCornerUnit(selectedUnits, "all"),
        showTooltip: true,
        units,
        value: getCornerValue(values, "all")
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { children: [
      "topLeft",
      "topRight",
      "bottomLeft",
      "bottomRight"
    ].map((corner) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_preset_input_control.default,
      {
        ariaLabel: import_constants.CORNERS[corner],
        className: "components-border-radius-control",
        icon: import_constants.ICONS[corner],
        minimumCustomValue: import_constants.MIN_BORDER_RADIUS_VALUE,
        onChange: createCornerChangeHandler(
          corner,
          values,
          onChange
        ),
        onUnitChange: createCornerUnitChangeHandler(
          corner,
          selectedUnits,
          setSelectedUnits
        ),
        presets: options,
        presetType: "border-radius",
        selectedUnit: getCornerUnit(
          selectedUnits,
          corner
        ),
        showTooltip: true,
        units,
        value: getCornerValue(values, corner)
      },
      corner
    )) })
  ] });
}
//# sourceMappingURL=index.cjs.map
