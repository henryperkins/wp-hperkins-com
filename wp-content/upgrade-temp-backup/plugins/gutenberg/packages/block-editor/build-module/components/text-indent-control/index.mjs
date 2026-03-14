// packages/block-editor/src/components/text-indent-control/index.js
import {
  __experimentalUnitControl as UnitControl,
  __experimentalUseCustomUnits as useCustomUnits,
  __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
  __experimentalView as View,
  RangeControl,
  __experimentalSpacer as Spacer,
  Flex,
  FlexItem,
  BaseControl
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSettings } from "../use-settings/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const [availableUnits] = useSettings("spacing.units");
  const units = useCustomUnits({
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
  const [valueQuantity, valueUnit] = parseQuantityAndUnitFromRawValue(
    value,
    units
  );
  const isValueUnitRelative = !!valueUnit && ["em", "rem", "%", "ch", "vw", "vh"].includes(valueUnit);
  if (!withSlider) {
    return /* @__PURE__ */ jsx(
      UnitControl,
      {
        __next40pxDefaultSize,
        __shouldNotWarnDeprecated36pxSize: true,
        ...otherProps,
        label: __("Line indent"),
        value,
        __unstableInputWidth,
        units,
        onChange,
        help
      }
    );
  }
  return /* @__PURE__ */ jsxs(View, { style: hasBottomMargin ? { marginBottom: 12 } : void 0, children: [
    /* @__PURE__ */ jsx(BaseControl.VisualLabel, { children: __("Line indent") }),
    /* @__PURE__ */ jsxs(Flex, { children: [
      /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(
        UnitControl,
        {
          __next40pxDefaultSize,
          __shouldNotWarnDeprecated36pxSize: true,
          label: __("Line indent"),
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
      withSlider && /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(Spacer, { marginX: 2, marginBottom: 0, children: /* @__PURE__ */ jsx(
        RangeControl,
        {
          __next40pxDefaultSize,
          __shouldNotWarnDeprecated36pxSize: true,
          label: __("Line indent"),
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
    help && /* @__PURE__ */ jsx("p", { className: "components-base-control__help", children: help })
  ] });
}
export {
  TextIndentControl as default
};
//# sourceMappingURL=index.mjs.map
