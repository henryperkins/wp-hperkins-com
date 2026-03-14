// packages/block-editor/src/components/preset-input-control/index.js
import {
  Button,
  CustomSelectControl,
  Icon,
  RangeControl,
  __experimentalHStack as HStack,
  __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue
} from "@wordpress/components";
import { usePrevious } from "@wordpress/compose";
import { __, sprintf } from "@wordpress/i18n";
import { settings } from "@wordpress/icons";
import { useState, useEffect, useMemo } from "@wordpress/element";
import {
  CUSTOM_VALUE_SETTINGS,
  ICON_SIZE,
  RANGE_CONTROL_MAX_SIZE
} from "./constants.mjs";
import {
  getCustomValueFromPreset,
  getPresetValueFromCustomValue,
  getSliderValueFromPreset,
  isValuePreset
} from "./utils.mjs";
import CustomValueControls from "./custom-value-controls.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PresetInputControl({
  allowNegativeOnDrag = false,
  ariaLabel,
  className: classNameProp,
  customValueSettings = CUSTOM_VALUE_SETTINGS,
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
  const value = useMemo(
    () => getPresetValueFromCustomValue(valueProp, presets, presetType),
    [valueProp, presets, presetType]
  );
  const className = classNameProp ?? "preset-input-control";
  const marks = presets.slice(1, presets.length - 1).map((_newValue, index) => ({
    value: index + 1,
    label: void 0
  }));
  const hasPresets = marks.length > 0;
  const showRangeControl = presets.length <= RANGE_CONTROL_MAX_SIZE;
  const allPlaceholder = isMixed ? __("Mixed") : null;
  const [minValue, setMinValue] = useState(minimumCustomValue);
  const [showCustomValueControl, setShowCustomValueControl] = useState(
    !disableCustomValues && value !== void 0 && !isValuePreset(value, presetType)
  );
  let currentValue = null;
  const previousValue = usePrevious(value);
  useEffect(() => {
    if (!!value && previousValue !== value && !isValuePreset(value, presetType) && showCustomValueControl !== true) {
      setShowCustomValueControl(true);
    }
  }, [value, previousValue, presetType, showCustomValueControl]);
  const showCustomValueInSelectList = !showRangeControl && !showCustomValueControl && value !== void 0 && (!isValuePreset(value, presetType) || isValuePreset(value, presetType) && isMixed);
  let selectListOptions = presets;
  if (showCustomValueInSelectList) {
    selectListOptions = [
      ...presets,
      {
        name: !isMixed ? (
          // translators: %s: A custom measurement, e.g. a number followed by a unit like 12px.
          sprintf(__("Custom (%s)"), value)
        ) : __("Mixed"),
        slug: "custom",
        size: value
      }
    ];
    currentValue = selectListOptions.length - 1;
  } else if (!isMixed) {
    currentValue = !showCustomValueControl ? getSliderValueFromPreset(value, presets, presetType) : getCustomValueFromPreset(value, presets, presetType);
  }
  const options = selectListOptions.map((size, index) => ({
    key: index,
    name: size.name
  }));
  const resolvedPresetValue = isValuePreset(value, presetType) ? getCustomValueFromPreset(value, presets, presetType) : value;
  const [parsedQuantity, parsedUnit] = parseQuantityAndUnitFromRawValue(resolvedPresetValue);
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
  return /* @__PURE__ */ jsxs(
    HStack,
    {
      className: `preset-input-control__wrapper ${className}__wrapper`,
      children: [
        icon && /* @__PURE__ */ jsx(
          Icon,
          {
            className: "preset-input-control__icon",
            icon,
            size: ICON_SIZE
          }
        ),
        (!hasPresets || showCustomValueControl) && /* @__PURE__ */ jsx(
          CustomValueControls,
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
        hasPresets && showRangeControl && !showCustomValueControl && /* @__PURE__ */ jsx(
          RangeControl,
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
        hasPresets && !showRangeControl && !showCustomValueControl && /* @__PURE__ */ jsx(
          CustomSelectControl,
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
        hasPresets && !disableCustomValues && /* @__PURE__ */ jsx(
          Button,
          {
            className: "preset-input-control__custom-toggle",
            icon: settings,
            iconSize: ICON_SIZE,
            isPressed: showCustomValueControl,
            label: showCustomValueControl ? __("Use preset") : __("Set custom value"),
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
export {
  PresetInputControl as default
};
//# sourceMappingURL=index.mjs.map
