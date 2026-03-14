// packages/block-editor/src/layouts/grid.js
import { __ } from "@wordpress/i18n";
import {
  BaseControl,
  Flex,
  FlexItem,
  RangeControl,
  __experimentalNumberControl as NumberControl,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption,
  __experimentalUnitControl as UnitControl,
  __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { appendSelectors, getBlockGapCSS } from "./utils.mjs";
import { getGapCSSValue } from "../hooks/gap.mjs";
import { shouldSkipSerialization } from "../hooks/utils.mjs";
import { LAYOUT_DEFINITIONS } from "./definitions.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var RANGE_CONTROL_MAX_VALUES = {
  px: 600,
  "%": 100,
  vw: 100,
  vh: 100,
  em: 38,
  rem: 38,
  svw: 100,
  lvw: 100,
  dvw: 100,
  svh: 100,
  lvh: 100,
  dvh: 100,
  vi: 100,
  svi: 100,
  lvi: 100,
  dvi: 100,
  vb: 100,
  svb: 100,
  lvb: 100,
  dvb: 100,
  vmin: 100,
  svmin: 100,
  lvmin: 100,
  dvmin: 100,
  vmax: 100,
  svmax: 100,
  lvmax: 100,
  dvmax: 100
};
var units = [
  { value: "px", label: "px", default: 0 },
  { value: "rem", label: "rem", default: 0 },
  { value: "em", label: "em", default: 0 }
];
var grid_default = {
  name: "grid",
  label: __("Grid"),
  inspectorControls: function GridLayoutInspectorControls({
    layout = {},
    onChange,
    layoutBlockSupport = {}
  }) {
    const { allowSizingOnChildren = false } = layoutBlockSupport;
    const showColumnsControl = true;
    const showMinWidthControl = !layout?.isManualPlacement || window.__experimentalEnableGridInteractivity;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      window.__experimentalEnableGridInteractivity && /* @__PURE__ */ jsx(
        GridLayoutTypeControl,
        {
          layout,
          onChange
        }
      ),
      /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
        showColumnsControl && /* @__PURE__ */ jsx(
          GridLayoutColumnsAndRowsControl,
          {
            layout,
            onChange,
            allowSizingOnChildren
          }
        ),
        showMinWidthControl && /* @__PURE__ */ jsx(
          GridLayoutMinimumWidthControl,
          {
            layout,
            onChange
          }
        )
      ] })
    ] });
  },
  toolBarControls: function GridLayoutToolbarControls() {
    return null;
  },
  getLayoutStyle: function getLayoutStyle({
    selector,
    layout,
    style,
    blockName,
    hasBlockGapSupport,
    globalBlockGapValue,
    layoutDefinitions = LAYOUT_DEFINITIONS
  }) {
    const {
      minimumColumnWidth = null,
      columnCount = null,
      rowCount = null
    } = layout;
    if (process.env.NODE_ENV === "development") {
      if (minimumColumnWidth && typeof minimumColumnWidth !== "string") {
        throw new Error("minimumColumnWidth must be a string");
      }
      if (columnCount && typeof columnCount !== "number") {
        throw new Error("columnCount must be a number");
      }
      if (rowCount && typeof rowCount !== "number") {
        throw new Error("rowCount must be a number");
      }
    }
    let fallbackGapValue = "1.2rem";
    if (globalBlockGapValue) {
      const processedGap = getGapCSSValue(globalBlockGapValue, "0.5em");
      const gapParts = processedGap.split(" ");
      fallbackGapValue = gapParts.length > 1 ? gapParts[1] : gapParts[0];
    }
    const blockGapValue = style?.spacing?.blockGap && !shouldSkipSerialization(blockName, "spacing", "blockGap") ? getGapCSSValue(style?.spacing?.blockGap, fallbackGapValue) : void 0;
    let output = "";
    const rules = [];
    if (minimumColumnWidth && columnCount > 0) {
      let blockGapToUse = blockGapValue || fallbackGapValue;
      if (blockGapToUse === "0" || blockGapToUse === 0) {
        blockGapToUse = "0px";
      }
      const maxValue = `max(min( ${minimumColumnWidth}, 100%), ( 100% - (${blockGapToUse}*${columnCount - 1}) ) / ${columnCount})`;
      rules.push(
        `grid-template-columns: repeat(auto-fill, minmax(${maxValue}, 1fr))`,
        `container-type: inline-size`
      );
      if (rowCount) {
        rules.push(
          `grid-template-rows: repeat(${rowCount}, minmax(1rem, auto))`
        );
      }
    } else if (columnCount) {
      rules.push(
        `grid-template-columns: repeat(${columnCount}, minmax(0, 1fr))`
      );
      if (rowCount) {
        rules.push(
          `grid-template-rows: repeat(${rowCount}, minmax(1rem, auto))`
        );
      }
    } else {
      rules.push(
        `grid-template-columns: repeat(auto-fill, minmax(min(${minimumColumnWidth || "12rem"}, 100%), 1fr))`,
        "container-type: inline-size"
      );
    }
    if (rules.length) {
      output = `${appendSelectors(selector)} { ${rules.join(
        "; "
      )}; }`;
    }
    if (hasBlockGapSupport && blockGapValue) {
      output += getBlockGapCSS(
        selector,
        layoutDefinitions,
        "grid",
        blockGapValue
      );
    }
    return output;
  },
  getOrientation() {
    return "horizontal";
  },
  getAlignments() {
    return [];
  }
};
function GridLayoutMinimumWidthControl({ layout, onChange }) {
  const { minimumColumnWidth, columnCount, isManualPlacement } = layout;
  const defaultValue = isManualPlacement || columnCount ? null : "12rem";
  const value = minimumColumnWidth || defaultValue;
  const [quantity, unit = "rem"] = parseQuantityAndUnitFromRawValue(value);
  const handleSliderChange = (next) => {
    onChange({
      ...layout,
      minimumColumnWidth: [next, unit].join("")
    });
  };
  const handleUnitChange = (newUnit) => {
    let newValue;
    if (["em", "rem"].includes(newUnit) && unit === "px") {
      newValue = (quantity / 16).toFixed(2) + newUnit;
    } else if (["em", "rem"].includes(unit) && newUnit === "px") {
      newValue = Math.round(quantity * 16) + newUnit;
    }
    onChange({
      ...layout,
      minimumColumnWidth: newValue
    });
  };
  return /* @__PURE__ */ jsxs("fieldset", { className: "block-editor-hooks__grid-layout-minimum-width-control", children: [
    /* @__PURE__ */ jsx(BaseControl.VisualLabel, { as: "legend", children: __("Min. column width") }),
    /* @__PURE__ */ jsxs(Flex, { gap: 4, children: [
      /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(
        UnitControl,
        {
          size: "__unstable-large",
          onChange: (newValue) => {
            onChange({
              ...layout,
              minimumColumnWidth: newValue === "" ? void 0 : newValue
            });
          },
          onUnitChange: handleUnitChange,
          value,
          units,
          min: 0,
          label: __("Minimum column width"),
          hideLabelFromVision: true
        }
      ) }),
      /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(
        RangeControl,
        {
          __next40pxDefaultSize: true,
          onChange: handleSliderChange,
          value: quantity || 0,
          min: 0,
          max: RANGE_CONTROL_MAX_VALUES[unit] || 600,
          withInputField: false,
          label: __("Minimum column width"),
          hideLabelFromVision: true
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "components-base-control__help", children: __(
      "Columns will wrap to fewer per row when they can no longer maintain the minimum width."
    ) })
  ] });
}
function GridLayoutColumnsAndRowsControl({
  layout,
  onChange,
  allowSizingOnChildren
}) {
  const defaultColumnCount = void 0;
  const {
    columnCount = defaultColumnCount,
    rowCount,
    isManualPlacement
  } = layout;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("fieldset", { className: "block-editor-hooks__grid-layout-columns-and-rows-controls", children: [
    !isManualPlacement && /* @__PURE__ */ jsx(BaseControl.VisualLabel, { as: "legend", children: __("Max. columns") }),
    /* @__PURE__ */ jsxs(Flex, { gap: 4, children: [
      /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: /* @__PURE__ */ jsx(
        NumberControl,
        {
          size: "__unstable-large",
          onChange: (value) => {
            const defaultNewColumnCount = isManualPlacement ? 1 : void 0;
            const newColumnCount = value === "" || value === "0" ? defaultNewColumnCount : parseInt(value, 10);
            onChange({
              ...layout,
              columnCount: newColumnCount
            });
          },
          value: columnCount,
          min: 1,
          label: __("Columns"),
          hideLabelFromVision: !isManualPlacement
        }
      ) }),
      /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: allowSizingOnChildren && isManualPlacement ? /* @__PURE__ */ jsx(
        NumberControl,
        {
          size: "__unstable-large",
          onChange: (value) => {
            const newRowCount = value === "" || value === "0" ? 1 : parseInt(value, 10);
            onChange({
              ...layout,
              rowCount: newRowCount
            });
          },
          value: rowCount,
          min: 1,
          label: __("Rows")
        }
      ) : /* @__PURE__ */ jsx(
        RangeControl,
        {
          __next40pxDefaultSize: true,
          value: columnCount ?? 1,
          onChange: (value) => onChange({
            ...layout,
            columnCount: value === "" || value === "0" ? 1 : value
          }),
          min: 1,
          max: 16,
          withInputField: false,
          label: __("Columns"),
          hideLabelFromVision: true
        }
      ) })
    ] })
  ] }) });
}
function GridLayoutTypeControl({ layout, onChange }) {
  const { columnCount, rowCount, minimumColumnWidth, isManualPlacement } = layout;
  const [tempColumnCount, setTempColumnCount] = useState(
    columnCount || 3
  );
  const [tempRowCount, setTempRowCount] = useState(rowCount);
  const [tempMinimumColumnWidth, setTempMinimumColumnWidth] = useState(
    minimumColumnWidth || "12rem"
  );
  const gridPlacement = isManualPlacement ? "manual" : "auto";
  const onChangeType = (value) => {
    if (value === "manual") {
      setTempMinimumColumnWidth(minimumColumnWidth || "12rem");
    } else {
      setTempColumnCount(columnCount || 3);
      setTempRowCount(rowCount);
    }
    onChange({
      ...layout,
      columnCount: value === "manual" ? tempColumnCount : tempColumnCount,
      rowCount: value === "manual" ? tempRowCount : void 0,
      isManualPlacement: value === "manual" ? true : void 0,
      minimumColumnWidth: value === "auto" ? tempMinimumColumnWidth : null
    });
  };
  const helpText = gridPlacement === "manual" ? __(
    "Grid items can be manually placed in any position on the grid."
  ) : __(
    "Grid items are placed automatically depending on their order."
  );
  return /* @__PURE__ */ jsxs(
    ToggleGroupControl,
    {
      __next40pxDefaultSize: true,
      label: __("Grid item position"),
      value: gridPlacement,
      onChange: onChangeType,
      isBlock: true,
      help: helpText,
      children: [
        /* @__PURE__ */ jsx(
          ToggleGroupControlOption,
          {
            value: "auto",
            label: __("Auto")
          },
          "auto"
        ),
        /* @__PURE__ */ jsx(
          ToggleGroupControlOption,
          {
            value: "manual",
            label: __("Manual")
          },
          "manual"
        )
      ]
    }
  );
}
export {
  grid_default as default
};
//# sourceMappingURL=grid.mjs.map
