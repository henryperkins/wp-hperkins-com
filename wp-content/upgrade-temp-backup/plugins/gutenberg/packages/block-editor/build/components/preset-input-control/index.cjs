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

// packages/block-editor/src/components/preset-input-control/index.js
var preset_input_control_exports = {};
__export(preset_input_control_exports, {
  default: () => PresetInputControl
});
module.exports = __toCommonJS(preset_input_control_exports);
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_constants = require("./constants.cjs");
var import_utils = require("./utils.cjs");
var import_custom_value_controls = __toESM(require("./custom-value-controls.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function PresetInputControl({
  allowNegativeOnDrag = false,
  ariaLabel,
  className: classNameProp,
  customValueSettings = import_constants.CUSTOM_VALUE_SETTINGS,
  disableCustomValues,
  icon,
  isMixed,
  value: valueProp,
  minimumCustomValue,
  onChange,
  onMouseOut,
  onMouseOver,
  onUnitChange,
  presets = [],
  presetType,
  selectedUnit,
  showTooltip,
  units
}) {
  const value = (0, import_element.useMemo)(
    () => (0, import_utils.getPresetValueFromCustomValue)(valueProp, presets, presetType),
    [valueProp, presets, presetType]
  );
  const className = classNameProp ?? "preset-input-control";
  const marks = presets.slice(1, presets.length - 1).map((_newValue, index) => ({
    value: index + 1,
    label: void 0
  }));
  const hasPresets = marks.length > 0;
  const showRangeControl = presets.length <= import_constants.RANGE_CONTROL_MAX_SIZE;
  const allPlaceholder = isMixed ? (0, import_i18n.__)("Mixed") : null;
  const [minValue, setMinValue] = (0, import_element.useState)(minimumCustomValue);
  const [showCustomValueControl, setShowCustomValueControl] = (0, import_element.useState)(
    !disableCustomValues && value !== void 0 && !(0, import_utils.isValuePreset)(value, presetType)
  );
  let currentValue = null;
  const previousValue = (0, import_compose.usePrevious)(value);
  (0, import_element.useEffect)(() => {
    if (!!value && previousValue !== value && !(0, import_utils.isValuePreset)(value, presetType) && showCustomValueControl !== true) {
      setShowCustomValueControl(true);
    }
  }, [value, previousValue, presetType, showCustomValueControl]);
  const showCustomValueInSelectList = !showRangeControl && !showCustomValueControl && value !== void 0 && (!(0, import_utils.isValuePreset)(value, presetType) || (0, import_utils.isValuePreset)(value, presetType) && isMixed);
  let selectListOptions = presets;
  if (showCustomValueInSelectList) {
    selectListOptions = [
      ...presets,
      {
        name: !isMixed ? (
          // translators: %s: A custom measurement, e.g. a number followed by a unit like 12px.
          (0, import_i18n.sprintf)((0, import_i18n.__)("Custom (%s)"), value)
        ) : (0, import_i18n.__)("Mixed"),
        slug: "custom",
        size: value
      }
    ];
    currentValue = selectListOptions.length - 1;
  } else if (!isMixed) {
    currentValue = !showCustomValueControl ? (0, import_utils.getSliderValueFromPreset)(value, presets, presetType) : (0, import_utils.getCustomValueFromPreset)(value, presets, presetType);
  }
  const options = selectListOptions.map((size, index) => ({
    key: index,
    name: size.name
  }));
  const resolvedPresetValue = (0, import_utils.isValuePreset)(value, presetType) ? (0, import_utils.getCustomValueFromPreset)(value, presets, presetType) : value;
  const [parsedQuantity, parsedUnit] = (0, import_components.__experimentalParseQuantityAndUnitFromRawValue)(resolvedPresetValue);
  const computedUnit = parsedUnit || selectedUnit || "px";
  const unitConfig = units?.find((item) => item.value === computedUnit);
  const step = unitConfig?.step ?? customValueSettings[computedUnit]?.steps ?? 0.1;
  const max = unitConfig?.max ?? customValueSettings[computedUnit]?.max ?? 10;
  const handleCustomValueChange = (newValue) => {
    const isNumeric = !isNaN(parseFloat(newValue));
    const newCustomValue = isNumeric ? newValue : void 0;
    if (newCustomValue !== void 0) {
      onChange(newCustomValue);
    }
  };
  const handleCustomValueSliderChange = (next) => {
    onChange([next, computedUnit].join(""));
  };
  const customTooltipContent = (newValue) => value === void 0 ? void 0 : presets[newValue]?.name;
  const getNewPresetValue = (next, controlType) => {
    const newValue = parseInt(next, 10);
    if (controlType === "selectList") {
      if (newValue === 0 && presets[0]?.slug === "0") {
        return "0";
      }
      if (newValue === 0) {
        return void 0;
      }
    } else if (newValue === 0) {
      return "0";
    }
    return `var:preset|${presetType}|${presets[next]?.slug}`;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalHStack,
    {
      className: `preset-input-control__wrapper ${className}__wrapper`,
      children: [
        icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Icon,
          {
            className: "preset-input-control__icon",
            icon,
            size: import_constants.ICON_SIZE
          }
        ),
        (!hasPresets || showCustomValueControl) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_custom_value_controls.default,
          {
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
            onCustomValueChange: handleCustomValueChange,
            onCustomValueSliderChange: handleCustomValueSliderChange,
            onUnitChange,
            onMouseOut,
            onMouseOver,
            setMinValue
          }
        ),
        hasPresets && showRangeControl && !showCustomValueControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.RangeControl,
          {
            "aria-valuenow": currentValue,
            "aria-valuetext": presets[currentValue]?.name,
            className: "preset-input-control__preset-range",
            hideLabelFromVision: true,
            initialPosition: 0,
            label: ariaLabel,
            max: presets.length - 1,
            marks,
            min: 0,
            onBlur: onMouseOut,
            onChange: (newValue) => onChange(getNewPresetValue(newValue)),
            onFocus: onMouseOver,
            onMouseDown: (event) => {
              const nearStart = event?.nativeEvent?.offsetX < 35;
              if (nearStart && value === void 0) {
                onChange("0");
              }
            },
            onMouseOut,
            onMouseOver,
            renderTooltipContent: customTooltipContent,
            step: 1,
            value: currentValue,
            withInputField: false,
            __next40pxDefaultSize: true
          }
        ),
        hasPresets && !showRangeControl && !showCustomValueControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.CustomSelectControl,
          {
            className: "preset-input-control__custom-select-control",
            hideLabelFromVision: true,
            label: ariaLabel,
            onBlur: onMouseOut,
            onChange: (selection) => {
              if (showCustomValueInSelectList && selection.selectedItem.key === options.length - 1) {
                setShowCustomValueControl(true);
              } else {
                onChange(
                  getNewPresetValue(
                    selection.selectedItem.key,
                    "selectList"
                  )
                );
              }
            },
            onFocus: onMouseOver,
            onMouseOut,
            onMouseOver,
            options,
            size: "__unstable-large",
            value: (
              // passing empty string as a fallback to continue using the
              // component in controlled mode
              options.find(
                (option) => option.key === currentValue
              ) || ""
            )
          }
        ),
        hasPresets && !disableCustomValues && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            className: "preset-input-control__custom-toggle",
            icon: import_icons.settings,
            iconSize: import_constants.ICON_SIZE,
            isPressed: showCustomValueControl,
            label: showCustomValueControl ? (0, import_i18n.__)("Use preset") : (0, import_i18n.__)("Set custom value"),
            onClick: () => {
              setShowCustomValueControl(!showCustomValueControl);
            },
            size: "small"
          }
        )
      ]
    }
  );
}
//# sourceMappingURL=index.cjs.map
