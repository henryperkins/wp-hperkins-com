// packages/block-editor/src/components/dimensions-tool/width-height-tool.js
import {
  __experimentalToolsPanelItem as ToolsPanelItem,
  __experimentalUnitControl as UnitControl
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function WidthHeightTool({
  panelId,
  value = {},
  onChange = () => {
  },
  units,
  isShownByDefault = true
}) {
  const width = value.width === "auto" ? "" : value.width ?? "";
  const height = value.height === "auto" ? "" : value.height ?? "";
  const onDimensionChange = (dimension) => (nextDimension) => {
    const nextValue = { ...value };
    if (!nextDimension) {
      delete nextValue[dimension];
    } else {
      nextValue[dimension] = nextDimension;
    }
    onChange(nextValue);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ToolsPanelItem,
      {
        style: { gridColumn: "span 1" },
        label: __("Width"),
        isShownByDefault,
        hasValue: () => width !== "",
        onDeselect: onDimensionChange("width"),
        panelId,
        children: /* @__PURE__ */ jsx(
          UnitControl,
          {
            label: __("Width"),
            placeholder: __("Auto"),
            labelPosition: "top",
            units,
            min: 0,
            value: width,
            onChange: onDimensionChange("width"),
            size: "__unstable-large"
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      ToolsPanelItem,
      {
        style: { gridColumn: "span 1" },
        label: __("Height"),
        isShownByDefault,
        hasValue: () => height !== "",
        onDeselect: onDimensionChange("height"),
        panelId,
        children: /* @__PURE__ */ jsx(
          UnitControl,
          {
            label: __("Height"),
            placeholder: __("Auto"),
            labelPosition: "top",
            units,
            min: 0,
            value: height,
            onChange: onDimensionChange("height"),
            size: "__unstable-large"
          }
        )
      }
    )
  ] });
}
export {
  WidthHeightTool as default
};
//# sourceMappingURL=width-height-tool.mjs.map
