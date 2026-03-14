// packages/block-editor/src/hooks/border.js
import clsx from "clsx";
import { hasBlockSupport, getBlockSupport } from "@wordpress/blocks";
import { __experimentalHasSplitBorders as hasSplitBorders } from "@wordpress/components";
import { Platform, useCallback, useMemo } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { useSelect } from "@wordpress/data";
import { getColorClassName } from "../components/colors/index.mjs";
import InspectorControls from "../components/inspector-controls/index.mjs";
import useMultipleOriginColorsAndGradients from "../components/colors-gradients/use-multiple-origin-colors-and-gradients.mjs";
import {
  cleanEmptyObject,
  shouldSkipSerialization,
  useBlockSettings
} from "./utils.mjs";
import {
  useHasBorderPanel,
  useHasBorderPanelControls,
  BorderPanel as StylesBorderPanel
} from "../components/global-styles/index.mjs";
import { store as blockEditorStore } from "../store/index.mjs";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var BORDER_SUPPORT_KEY = "__experimentalBorder";
var SHADOW_SUPPORT_KEY = "shadow";
var getColorByProperty = (colors, property, value) => {
  let matchedColor;
  colors.some(
    (origin) => origin.colors.some((color) => {
      if (color[property] === value) {
        matchedColor = color;
        return true;
      }
      return false;
    })
  );
  return matchedColor;
};
var getMultiOriginColor = ({ colors, namedColor, customColor }) => {
  if (namedColor) {
    const colorObject2 = getColorByProperty(colors, "slug", namedColor);
    if (colorObject2) {
      return colorObject2;
    }
  }
  if (!customColor) {
    return { color: void 0 };
  }
  const colorObject = getColorByProperty(colors, "color", customColor);
  return colorObject ? colorObject : { color: customColor };
};
function getColorSlugFromVariable(value) {
  const namedColor = /var:preset\|color\|(.+)/.exec(value);
  if (namedColor && namedColor[1]) {
    return namedColor[1];
  }
  return null;
}
function styleToAttributes(style) {
  if (hasSplitBorders(style?.border)) {
    return {
      style,
      borderColor: void 0
    };
  }
  const borderColorValue = style?.border?.color;
  const borderColorSlug = borderColorValue?.startsWith("var:preset|color|") ? borderColorValue.substring("var:preset|color|".length) : void 0;
  const updatedStyle = { ...style };
  updatedStyle.border = {
    ...updatedStyle.border,
    color: borderColorSlug ? void 0 : borderColorValue
  };
  return {
    style: cleanEmptyObject(updatedStyle),
    borderColor: borderColorSlug
  };
}
function attributesToStyle(attributes) {
  if (hasSplitBorders(attributes.style?.border)) {
    return attributes.style;
  }
  return {
    ...attributes.style,
    border: {
      ...attributes.style?.border,
      color: attributes.borderColor ? "var:preset|color|" + attributes.borderColor : attributes.style?.border?.color
    }
  };
}
function BordersInspectorControl({ label, children, resetAllFilter }) {
  const attributesResetAllFilter = useCallback(
    (attributes) => {
      const existingStyle = attributesToStyle(attributes);
      const updatedStyle = resetAllFilter(existingStyle);
      return {
        ...attributes,
        ...styleToAttributes(updatedStyle)
      };
    },
    [resetAllFilter]
  );
  return /* @__PURE__ */ jsx(
    InspectorControls,
    {
      group: "border",
      resetAllFilter: attributesResetAllFilter,
      label,
      children
    }
  );
}
function BorderPanel({ clientId, name, setAttributes, settings }) {
  const isEnabled = useHasBorderPanel(settings);
  const { style, borderColor } = useSelect(
    (select) => {
      if (!isEnabled) {
        return {};
      }
      const { style: _style, borderColor: _borderColor } = select(blockEditorStore).getBlockAttributes(clientId) || {};
      return { style: _style, borderColor: _borderColor };
    },
    [clientId, isEnabled]
  );
  const value = useMemo(() => {
    return attributesToStyle({ style, borderColor });
  }, [style, borderColor]);
  const onChange = (newStyle) => {
    setAttributes(styleToAttributes(newStyle));
  };
  if (!isEnabled) {
    return null;
  }
  const defaultControls = {
    ...getBlockSupport(name, [
      BORDER_SUPPORT_KEY,
      "__experimentalDefaultControls"
    ]),
    ...getBlockSupport(name, [
      SHADOW_SUPPORT_KEY,
      "__experimentalDefaultControls"
    ])
  };
  return /* @__PURE__ */ jsx(
    StylesBorderPanel,
    {
      as: BordersInspectorControl,
      panelId: clientId,
      settings,
      value,
      onChange,
      defaultControls
    }
  );
}
function hasBorderSupport(blockName, feature = "any") {
  if (Platform.OS !== "web") {
    return false;
  }
  const support = getBlockSupport(blockName, BORDER_SUPPORT_KEY);
  if (support === true) {
    return true;
  }
  if (feature === "any") {
    return !!(support?.color || support?.radius || support?.width || support?.style);
  }
  return !!support?.[feature];
}
function hasShadowSupport(blockName) {
  return hasBlockSupport(blockName, SHADOW_SUPPORT_KEY);
}
function useBorderPanelLabel({
  blockName,
  hasBorderControl,
  hasShadowControl
} = {}) {
  const settings = useBlockSettings(blockName);
  const controls = useHasBorderPanelControls(settings);
  if (!hasBorderControl && !hasShadowControl && blockName) {
    hasBorderControl = controls?.hasBorderColor || controls?.hasBorderStyle || controls?.hasBorderWidth || controls?.hasBorderRadius;
    hasShadowControl = controls?.hasShadow;
  }
  if (hasBorderControl && hasShadowControl) {
    return __("Border & Shadow");
  }
  if (hasShadowControl) {
    return __("Shadow");
  }
  return __("Border");
}
function removeBorderAttribute(style, attribute) {
  return cleanEmptyObject({
    ...style,
    border: {
      ...style?.border,
      [attribute]: void 0
    }
  });
}
function addAttributes(settings) {
  if (!hasBorderSupport(settings, "color")) {
    return settings;
  }
  if (settings.attributes.borderColor) {
    return settings;
  }
  return {
    ...settings,
    attributes: {
      ...settings.attributes,
      borderColor: {
        type: "string"
      }
    }
  };
}
function addSaveProps(props, blockNameOrType, attributes) {
  if (!hasBorderSupport(blockNameOrType, "color") || shouldSkipSerialization(blockNameOrType, BORDER_SUPPORT_KEY, "color")) {
    return props;
  }
  const borderClasses = getBorderClasses(attributes);
  const newClassName = clsx(props.className, borderClasses);
  props.className = newClassName ? newClassName : void 0;
  return props;
}
function getBorderClasses(attributes) {
  const { borderColor, style } = attributes;
  const borderColorClass = getColorClassName("border-color", borderColor);
  return clsx({
    "has-border-color": borderColor || style?.border?.color,
    [borderColorClass]: !!borderColorClass
  });
}
function useBlockProps({ name, borderColor, style }) {
  const { colors } = useMultipleOriginColorsAndGradients();
  if (!hasBorderSupport(name, "color") || shouldSkipSerialization(name, BORDER_SUPPORT_KEY, "color")) {
    return {};
  }
  const { color: borderColorValue } = getMultiOriginColor({
    colors,
    namedColor: borderColor
  });
  const { color: borderTopColor } = getMultiOriginColor({
    colors,
    namedColor: getColorSlugFromVariable(style?.border?.top?.color)
  });
  const { color: borderRightColor } = getMultiOriginColor({
    colors,
    namedColor: getColorSlugFromVariable(style?.border?.right?.color)
  });
  const { color: borderBottomColor } = getMultiOriginColor({
    colors,
    namedColor: getColorSlugFromVariable(style?.border?.bottom?.color)
  });
  const { color: borderLeftColor } = getMultiOriginColor({
    colors,
    namedColor: getColorSlugFromVariable(style?.border?.left?.color)
  });
  const extraStyles = {
    borderTopColor: borderTopColor || borderColorValue,
    borderRightColor: borderRightColor || borderColorValue,
    borderBottomColor: borderBottomColor || borderColorValue,
    borderLeftColor: borderLeftColor || borderColorValue
  };
  return addSaveProps(
    { style: cleanEmptyObject(extraStyles) || {} },
    name,
    { borderColor, style }
  );
}
var border_default = {
  useBlockProps,
  addSaveProps,
  attributeKeys: ["borderColor", "style"],
  hasSupport(name) {
    return hasBorderSupport(name, "color");
  }
};
addFilter(
  "blocks.registerBlockType",
  "core/border/addAttributes",
  addAttributes
);
export {
  BORDER_SUPPORT_KEY,
  BorderPanel,
  SHADOW_SUPPORT_KEY,
  border_default as default,
  getBorderClasses,
  getMultiOriginColor,
  hasBorderSupport,
  hasShadowSupport,
  removeBorderAttribute,
  useBorderPanelLabel
};
//# sourceMappingURL=border.mjs.map
