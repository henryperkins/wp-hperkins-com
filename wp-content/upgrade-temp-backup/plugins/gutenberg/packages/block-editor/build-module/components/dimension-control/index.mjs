// packages/block-editor/src/components/dimension-control/index.js
import { useMemo, useState } from "@wordpress/element";
import {
  BaseControl,
  __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
  __experimentalUseCustomUnits as useCustomUnits
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSettings } from "../use-settings/index.mjs";
import PresetInputControl from "../preset-input-control/index.mjs";
import { CUSTOM_VALUE_SETTINGS } from "../preset-input-control/constants.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var EMPTY_ARRAY = [];
var DIMENSION_CUSTOM_VALUE_SETTINGS = {
  ...CUSTOM_VALUE_SETTINGS,
  px: { max: 1e3, steps: 1 },
  em: { max: 50, steps: 0.1 },
  rem: { max: 50, steps: 0.1 }
};
function useDimensionSizes(presets) {
  const defaultSizes = presets?.default ?? EMPTY_ARRAY;
  const customSizes = presets?.custom ?? EMPTY_ARRAY;
  const themeSizes = presets?.theme ?? EMPTY_ARRAY;
  return useMemo(() => {
    const sizes = [
      { name: __("None"), slug: "0", size: 0 },
      ...customSizes,
      ...themeSizes,
      ...defaultSizes
    ];
    return sizes;
  }, [customSizes, themeSizes, defaultSizes]);
}
function DimensionControl({
  label = __("Dimension"),
  onChange,
  value,
  dimensionSizes: dimensionSizesProp
}) {
  const [dimensionSizesFromSettings, availableUnits] = useSettings(
    "dimensions.dimensionSizes",
    "spacing.units"
  );
  const dimensionSizes = dimensionSizesProp ?? dimensionSizesFromSettings;
  const units = useCustomUnits({
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
  const [selectedUnit, setSelectedUnit] = useState(() => {
    const [, unit] = parseQuantityAndUnitFromRawValue(value);
    return unit || units[0]?.value || "px";
  });
  const handleUnitChange = (newUnit) => {
    const [currentValue, currentUnit] = parseQuantityAndUnitFromRawValue(value);
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
  return /* @__PURE__ */ jsxs("fieldset", { className: "block-editor-dimension-control", children: [
    /* @__PURE__ */ jsx(BaseControl.VisualLabel, { as: "legend", children: label }),
    /* @__PURE__ */ jsx(
      PresetInputControl,
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
export {
  DimensionControl as default
};
//# sourceMappingURL=index.mjs.map
