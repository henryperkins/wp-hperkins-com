// packages/block-editor/src/components/preset-input-control/custom-value-controls.js
import {
  RangeControl,
  Tooltip,
  __experimentalUnitControl as UnitControl
} from "@wordpress/components";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  const unitControl = /* @__PURE__ */ jsx(
    UnitControl,
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
  const wrappedUnitControl = showTooltip ? /* @__PURE__ */ jsx(Tooltip, { text: ariaLabel, placement: "top", children: /* @__PURE__ */ jsx("div", { className: "preset-input-control__tooltip-wrapper", children: unitControl }) }) : unitControl;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    wrappedUnitControl,
    /* @__PURE__ */ jsx(
      RangeControl,
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
export {
  CustomValueControls as default
};
//# sourceMappingURL=custom-value-controls.mjs.map
