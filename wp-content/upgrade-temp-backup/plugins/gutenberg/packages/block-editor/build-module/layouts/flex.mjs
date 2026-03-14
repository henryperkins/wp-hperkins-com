// packages/block-editor/src/layouts/flex.js
import { __ } from "@wordpress/i18n";
import {
  justifyLeft,
  justifyCenter,
  justifyRight,
  justifySpaceBetween,
  justifyStretch,
  arrowRight,
  arrowDown
} from "@wordpress/icons";
import {
  ToggleControl,
  Flex,
  FlexItem,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon
} from "@wordpress/components";
import { appendSelectors, getBlockGapCSS } from "./utils.mjs";
import { getGapCSSValue } from "../hooks/gap.mjs";
import {
  BlockControls,
  JustifyContentControl,
  BlockVerticalAlignmentControl
} from "../components/index.mjs";
import { shouldSkipSerialization } from "../hooks/utils.mjs";
import { LAYOUT_DEFINITIONS } from "./definitions.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var justifyContentMap = {
  left: "flex-start",
  right: "flex-end",
  center: "center",
  "space-between": "space-between"
};
var alignItemsMap = {
  left: "flex-start",
  right: "flex-end",
  center: "center",
  stretch: "stretch"
};
var verticalAlignmentMap = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
  stretch: "stretch",
  "space-between": "space-between"
};
var defaultAlignments = {
  horizontal: "center",
  vertical: "top"
};
var flexWrapOptions = ["wrap", "nowrap"];
var flex_default = {
  name: "flex",
  label: __("Flex"),
  inspectorControls: function FlexLayoutInspectorControls({
    layout = {},
    onChange,
    layoutBlockSupport = {}
  }) {
    const {
      allowOrientation = true,
      allowJustification = true,
      allowWrap = true
    } = layoutBlockSupport;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Flex, { children: [
        allowJustification && /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
          FlexLayoutJustifyContentControl,
          {
            layout,
            onChange
          }
        ) }),
        allowOrientation && /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
          OrientationControl,
          {
            layout,
            onChange
          }
        ) })
      ] }),
      allowWrap && /* @__PURE__ */ jsx(FlexWrapControl, { layout, onChange })
    ] });
  },
  toolBarControls: function FlexLayoutToolbarControls({
    layout = {},
    onChange,
    layoutBlockSupport
  }) {
    const { allowVerticalAlignment = true, allowJustification = true } = layoutBlockSupport;
    if (!allowJustification && !allowVerticalAlignment) {
      return null;
    }
    return /* @__PURE__ */ jsxs(BlockControls, { group: "block", __experimentalShareWithChildBlocks: true, children: [
      allowJustification && /* @__PURE__ */ jsx(
        FlexLayoutJustifyContentControl,
        {
          layout,
          onChange,
          isToolbar: true
        }
      ),
      allowVerticalAlignment && /* @__PURE__ */ jsx(
        FlexLayoutVerticalAlignmentControl,
        {
          layout,
          onChange
        }
      )
    ] });
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
    const { orientation = "horizontal" } = layout;
    let fallbackGapValue = "0.5em";
    if (globalBlockGapValue) {
      const processedGlobalGap = getGapCSSValue(
        globalBlockGapValue,
        "0.5em"
      );
      const gapParts = processedGlobalGap.split(" ");
      fallbackGapValue = gapParts.length > 1 ? gapParts[1] : gapParts[0];
    }
    const blockGapValue = style?.spacing?.blockGap && !shouldSkipSerialization(blockName, "spacing", "blockGap") ? getGapCSSValue(style?.spacing?.blockGap, fallbackGapValue) : void 0;
    const justifyContent = justifyContentMap[layout.justifyContent];
    const flexWrap = flexWrapOptions.includes(layout.flexWrap) ? layout.flexWrap : "wrap";
    const verticalAlignment = verticalAlignmentMap[layout.verticalAlignment];
    const alignItems = alignItemsMap[layout.justifyContent] || alignItemsMap.left;
    let output = "";
    const rules = [];
    if (flexWrap && flexWrap !== "wrap") {
      rules.push(`flex-wrap: ${flexWrap}`);
    }
    if (orientation === "horizontal") {
      if (verticalAlignment) {
        rules.push(`align-items: ${verticalAlignment}`);
      }
      if (justifyContent) {
        rules.push(`justify-content: ${justifyContent}`);
      }
    } else {
      if (verticalAlignment) {
        rules.push(`justify-content: ${verticalAlignment}`);
      }
      rules.push("flex-direction: column");
      rules.push(`align-items: ${alignItems}`);
    }
    if (rules.length) {
      output = `${appendSelectors(selector)} {
				${rules.join("; ")};
			}`;
    }
    if (hasBlockGapSupport && blockGapValue) {
      output += getBlockGapCSS(
        selector,
        layoutDefinitions,
        "flex",
        blockGapValue
      );
    }
    return output;
  },
  getOrientation(layout) {
    const { orientation = "horizontal" } = layout;
    return orientation;
  },
  getAlignments() {
    return [];
  }
};
function FlexLayoutVerticalAlignmentControl({ layout, onChange }) {
  const { orientation = "horizontal" } = layout;
  const defaultVerticalAlignment = orientation === "horizontal" ? defaultAlignments.horizontal : defaultAlignments.vertical;
  const { verticalAlignment = defaultVerticalAlignment } = layout;
  const onVerticalAlignmentChange = (value) => {
    onChange({
      ...layout,
      verticalAlignment: value
    });
  };
  return /* @__PURE__ */ jsx(
    BlockVerticalAlignmentControl,
    {
      onChange: onVerticalAlignmentChange,
      value: verticalAlignment,
      controls: orientation === "horizontal" ? ["top", "center", "bottom", "stretch"] : ["top", "center", "bottom", "space-between"]
    }
  );
}
var POPOVER_PROPS = {
  placement: "bottom-start"
};
function FlexLayoutJustifyContentControl({
  layout,
  onChange,
  isToolbar = false
}) {
  const { justifyContent = "left", orientation = "horizontal" } = layout;
  const onJustificationChange = (value) => {
    onChange({
      ...layout,
      justifyContent: value
    });
  };
  const allowedControls = ["left", "center", "right"];
  if (orientation === "horizontal") {
    allowedControls.push("space-between");
  } else {
    allowedControls.push("stretch");
  }
  if (isToolbar) {
    return /* @__PURE__ */ jsx(
      JustifyContentControl,
      {
        allowedControls,
        value: justifyContent,
        onChange: onJustificationChange,
        popoverProps: POPOVER_PROPS
      }
    );
  }
  const justificationOptions = [
    {
      value: "left",
      icon: justifyLeft,
      label: __("Justify items left")
    },
    {
      value: "center",
      icon: justifyCenter,
      label: __("Justify items center")
    },
    {
      value: "right",
      icon: justifyRight,
      label: __("Justify items right")
    }
  ];
  if (orientation === "horizontal") {
    justificationOptions.push({
      value: "space-between",
      icon: justifySpaceBetween,
      label: __("Space between items")
    });
  } else {
    justificationOptions.push({
      value: "stretch",
      icon: justifyStretch,
      label: __("Stretch items")
    });
  }
  return /* @__PURE__ */ jsx(
    ToggleGroupControl,
    {
      __next40pxDefaultSize: true,
      label: __("Justification"),
      value: justifyContent,
      onChange: onJustificationChange,
      className: "block-editor-hooks__flex-layout-justification-controls",
      children: justificationOptions.map(({ value, icon, label }) => {
        return /* @__PURE__ */ jsx(
          ToggleGroupControlOptionIcon,
          {
            value,
            icon,
            label
          },
          value
        );
      })
    }
  );
}
function FlexWrapControl({ layout, onChange }) {
  const { flexWrap = "wrap" } = layout;
  return /* @__PURE__ */ jsx(
    ToggleControl,
    {
      label: __("Allow to wrap to multiple lines"),
      onChange: (value) => {
        onChange({
          ...layout,
          flexWrap: value ? "wrap" : "nowrap"
        });
      },
      checked: flexWrap === "wrap"
    }
  );
}
function OrientationControl({ layout, onChange }) {
  const {
    orientation = "horizontal",
    verticalAlignment,
    justifyContent
  } = layout;
  return /* @__PURE__ */ jsxs(
    ToggleGroupControl,
    {
      __next40pxDefaultSize: true,
      className: "block-editor-hooks__flex-layout-orientation-controls",
      label: __("Orientation"),
      value: orientation,
      onChange: (value) => {
        let newVerticalAlignment = verticalAlignment;
        let newJustification = justifyContent;
        if (value === "horizontal") {
          if (verticalAlignment === "space-between") {
            newVerticalAlignment = "center";
          }
          if (justifyContent === "stretch") {
            newJustification = "left";
          }
        } else {
          if (verticalAlignment === "stretch") {
            newVerticalAlignment = "top";
          }
          if (justifyContent === "space-between") {
            newJustification = "left";
          }
        }
        return onChange({
          ...layout,
          orientation: value,
          verticalAlignment: newVerticalAlignment,
          justifyContent: newJustification
        });
      },
      children: [
        /* @__PURE__ */ jsx(
          ToggleGroupControlOptionIcon,
          {
            icon: arrowRight,
            value: "horizontal",
            label: __("Horizontal")
          }
        ),
        /* @__PURE__ */ jsx(
          ToggleGroupControlOptionIcon,
          {
            icon: arrowDown,
            value: "vertical",
            label: __("Vertical")
          }
        )
      ]
    }
  );
}
export {
  flex_default as default
};
//# sourceMappingURL=flex.mjs.map
