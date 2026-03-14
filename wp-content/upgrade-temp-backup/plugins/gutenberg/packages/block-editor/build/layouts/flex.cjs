"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/layouts/flex.js
var flex_exports = {};
__export(flex_exports, {
  default: () => flex_default
});
module.exports = __toCommonJS(flex_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_utils = require("./utils.cjs");
var import_gap = require("../hooks/gap.cjs");
var import_components2 = require("../components/index.cjs");
var import_utils2 = require("../hooks/utils.cjs");
var import_definitions = require("./definitions.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  label: (0, import_i18n.__)("Flex"),
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { children: [
        allowJustification && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          FlexLayoutJustifyContentControl,
          {
            layout,
            onChange
          }
        ) }),
        allowOrientation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          OrientationControl,
          {
            layout,
            onChange
          }
        ) })
      ] }),
      allowWrap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlexWrapControl, { layout, onChange })
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components2.BlockControls, { group: "block", __experimentalShareWithChildBlocks: true, children: [
      allowJustification && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FlexLayoutJustifyContentControl,
        {
          layout,
          onChange,
          isToolbar: true
        }
      ),
      allowVerticalAlignment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    layoutDefinitions = import_definitions.LAYOUT_DEFINITIONS
  }) {
    const { orientation = "horizontal" } = layout;
    let fallbackGapValue = "0.5em";
    if (globalBlockGapValue) {
      const processedGlobalGap = (0, import_gap.getGapCSSValue)(
        globalBlockGapValue,
        "0.5em"
      );
      const gapParts = processedGlobalGap.split(" ");
      fallbackGapValue = gapParts.length > 1 ? gapParts[1] : gapParts[0];
    }
    const blockGapValue = style?.spacing?.blockGap && !(0, import_utils2.shouldSkipSerialization)(blockName, "spacing", "blockGap") ? (0, import_gap.getGapCSSValue)(style?.spacing?.blockGap, fallbackGapValue) : void 0;
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
      output = `${(0, import_utils.appendSelectors)(selector)} {
				${rules.join("; ")};
			}`;
    }
    if (hasBlockGapSupport && blockGapValue) {
      output += (0, import_utils.getBlockGapCSS)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components2.BlockVerticalAlignmentControl,
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components2.JustifyContentControl,
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
      icon: import_icons.justifyLeft,
      label: (0, import_i18n.__)("Justify items left")
    },
    {
      value: "center",
      icon: import_icons.justifyCenter,
      label: (0, import_i18n.__)("Justify items center")
    },
    {
      value: "right",
      icon: import_icons.justifyRight,
      label: (0, import_i18n.__)("Justify items right")
    }
  ];
  if (orientation === "horizontal") {
    justificationOptions.push({
      value: "space-between",
      icon: import_icons.justifySpaceBetween,
      label: (0, import_i18n.__)("Space between items")
    });
  } else {
    justificationOptions.push({
      value: "stretch",
      icon: import_icons.justifyStretch,
      label: (0, import_i18n.__)("Stretch items")
    });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalToggleGroupControl,
    {
      __next40pxDefaultSize: true,
      label: (0, import_i18n.__)("Justification"),
      value: justifyContent,
      onChange: onJustificationChange,
      className: "block-editor-hooks__flex-layout-justification-controls",
      children: justificationOptions.map(({ value, icon, label }) => {
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalToggleGroupControlOptionIcon,
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToggleControl,
    {
      label: (0, import_i18n.__)("Allow to wrap to multiple lines"),
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalToggleGroupControl,
    {
      __next40pxDefaultSize: true,
      className: "block-editor-hooks__flex-layout-orientation-controls",
      label: (0, import_i18n.__)("Orientation"),
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalToggleGroupControlOptionIcon,
          {
            icon: import_icons.arrowRight,
            value: "horizontal",
            label: (0, import_i18n.__)("Horizontal")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalToggleGroupControlOptionIcon,
          {
            icon: import_icons.arrowDown,
            value: "vertical",
            label: (0, import_i18n.__)("Vertical")
          }
        )
      ]
    }
  );
}
//# sourceMappingURL=flex.cjs.map
