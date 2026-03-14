// packages/global-styles-ui/src/size-control/index.tsx
import {
  BaseControl,
  RangeControl,
  Flex,
  FlexItem,
  useBaseControlProps,
  __experimentalUseCustomUnits as useCustomUnits,
  __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
  __experimentalUnitControl as UnitControl,
  __experimentalSpacer as Spacer
} from "@wordpress/components";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_UNITS = ["px", "em", "rem", "vw", "vh"];
function SizeControl(props) {
  const { baseControlProps } = useBaseControlProps(props);
  const { value, onChange, fallbackValue, disabled, label } = props;
  const units = useCustomUnits({
    availableUnits: DEFAULT_UNITS
  });
  const [valueQuantity, valueUnit = "px"] = parseQuantityAndUnitFromRawValue(value, units);
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
  return /* @__PURE__ */ jsx(BaseControl, { ...baseControlProps, children: /* @__PURE__ */ jsxs(Flex, { children: [
    /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(
      UnitControl,
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
    /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(Spacer, { marginX: 2, marginBottom: 0, children: /* @__PURE__ */ jsx(
      RangeControl,
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
export {
  SizeControl
};
//# sourceMappingURL=index.mjs.map
