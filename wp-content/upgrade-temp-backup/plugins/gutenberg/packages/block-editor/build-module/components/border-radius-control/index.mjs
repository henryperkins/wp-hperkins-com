// packages/block-editor/src/components/border-radius-control/index.js
import {
  BaseControl,
  __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
  __experimentalUseCustomUnits as useCustomUnits,
  __experimentalVStack as VStack,
  __experimentalHStack as HStack
} from "@wordpress/components";
import { useState, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import LinkedButton from "./linked-button.mjs";
import { useSettings } from "../use-settings/index.mjs";
import { hasDefinedValues, hasMixedValues, getAllValue } from "./utils.mjs";
import PresetInputControl from "../preset-input-control/index.mjs";
import {
  RANGE_CONTROL_MAX_SIZE,
  EMPTY_ARRAY,
  CORNERS,
  ICONS,
  MIN_BORDER_RADIUS_VALUE
} from "./constants.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function useBorderRadiusSizes(presets) {
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
    return sizes.length > RANGE_CONTROL_MAX_SIZE ? [
      {
        name: __("Default"),
        slug: "default",
        size: void 0
      },
      ...sizes
    ] : sizes;
  }, [customSizes, themeSizes, defaultSizes]);
}
function getCornerValue(values, corner) {
  if (corner === "all") {
    return getAllValue(values);
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
  const [isLinked, setIsLinked] = useState(
    !hasDefinedValues(values) || !hasMixedValues(values)
  );
  const options = useBorderRadiusSizes(presets);
  const [selectedUnits, setSelectedUnits] = useState({
    flat: typeof values === "string" ? parseQuantityAndUnitFromRawValue(values)[1] : void 0,
    topLeft: parseQuantityAndUnitFromRawValue(values?.topLeft)[1],
    topRight: parseQuantityAndUnitFromRawValue(values?.topRight)[1],
    bottomLeft: parseQuantityAndUnitFromRawValue(values?.bottomLeft)[1],
    bottomRight: parseQuantityAndUnitFromRawValue(
      values?.bottomRight
    )[1]
  });
  const [availableUnits] = useSettings("spacing.units");
  const units = useCustomUnits({
    availableUnits: availableUnits || ["px", "em", "rem"]
  });
  const toggleLinked = () => setIsLinked(!isLinked);
  return /* @__PURE__ */ jsxs("fieldset", { className: "components-border-radius-control", children: [
    /* @__PURE__ */ jsxs(HStack, { className: "components-border-radius-control__header", children: [
      /* @__PURE__ */ jsx(BaseControl.VisualLabel, { as: "legend", children: __("Radius") }),
      /* @__PURE__ */ jsx(LinkedButton, { onClick: toggleLinked, isLinked })
    ] }),
    isLinked ? /* @__PURE__ */ jsx(
      PresetInputControl,
      {
        ariaLabel: CORNERS.all,
        className: "components-border-radius-control",
        icon: ICONS.all,
        minimumCustomValue: MIN_BORDER_RADIUS_VALUE,
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
    ) : /* @__PURE__ */ jsx(VStack, { children: [
      "topLeft",
      "topRight",
      "bottomLeft",
      "bottomRight"
    ].map((corner) => /* @__PURE__ */ jsx(
      PresetInputControl,
      {
        ariaLabel: CORNERS[corner],
        className: "components-border-radius-control",
        icon: ICONS[corner],
        minimumCustomValue: MIN_BORDER_RADIUS_VALUE,
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
export {
  BorderRadiusControl as default
};
//# sourceMappingURL=index.mjs.map
