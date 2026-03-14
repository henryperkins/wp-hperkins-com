// packages/block-editor/src/hooks/typography.js
import { getBlockSupport, hasBlockSupport } from "@wordpress/blocks";
import { useMemo, useCallback } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import InspectorControls from "../components/inspector-controls/index.mjs";
import {
  default as StylesTypographyPanel,
  useHasTypographyPanel
} from "../components/global-styles/typography-panel.mjs";
import { LINE_HEIGHT_SUPPORT_KEY } from "./line-height.mjs";
import { FONT_FAMILY_SUPPORT_KEY } from "./font-family.mjs";
import { FONT_SIZE_SUPPORT_KEY } from "./font-size.mjs";
import { TEXT_ALIGN_SUPPORT_KEY } from "./text-align.mjs";
import { FIT_TEXT_SUPPORT_KEY } from "./fit-text.mjs";
import { cleanEmptyObject } from "./utils.mjs";
import { store as blockEditorStore } from "../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function omit(object, keys) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key))
  );
}
var LETTER_SPACING_SUPPORT_KEY = "typography.__experimentalLetterSpacing";
var TEXT_TRANSFORM_SUPPORT_KEY = "typography.__experimentalTextTransform";
var TEXT_DECORATION_SUPPORT_KEY = "typography.__experimentalTextDecoration";
var TEXT_INDENT_SUPPORT_KEY = "typography.textIndent";
var TEXT_COLUMNS_SUPPORT_KEY = "typography.textColumns";
var FONT_STYLE_SUPPORT_KEY = "typography.__experimentalFontStyle";
var FONT_WEIGHT_SUPPORT_KEY = "typography.__experimentalFontWeight";
var WRITING_MODE_SUPPORT_KEY = "typography.__experimentalWritingMode";
var TYPOGRAPHY_SUPPORT_KEY = "typography";
var TYPOGRAPHY_SUPPORT_KEYS = [
  LINE_HEIGHT_SUPPORT_KEY,
  FONT_SIZE_SUPPORT_KEY,
  FONT_STYLE_SUPPORT_KEY,
  FONT_WEIGHT_SUPPORT_KEY,
  FONT_FAMILY_SUPPORT_KEY,
  TEXT_ALIGN_SUPPORT_KEY,
  TEXT_COLUMNS_SUPPORT_KEY,
  TEXT_DECORATION_SUPPORT_KEY,
  TEXT_INDENT_SUPPORT_KEY,
  WRITING_MODE_SUPPORT_KEY,
  TEXT_TRANSFORM_SUPPORT_KEY,
  LETTER_SPACING_SUPPORT_KEY,
  FIT_TEXT_SUPPORT_KEY
];
function styleToAttributes(style) {
  const updatedStyle = { ...omit(style, ["fontFamily"]) };
  const fontSizeValue = style?.typography?.fontSize;
  const fontFamilyValue = style?.typography?.fontFamily;
  const fontSizeSlug = typeof fontSizeValue === "string" && fontSizeValue?.startsWith("var:preset|font-size|") ? fontSizeValue.substring("var:preset|font-size|".length) : void 0;
  const fontFamilySlug = fontFamilyValue?.startsWith(
    "var:preset|font-family|"
  ) ? fontFamilyValue.substring("var:preset|font-family|".length) : void 0;
  updatedStyle.typography = {
    ...omit(updatedStyle.typography, ["fontFamily"]),
    fontSize: fontSizeSlug ? void 0 : fontSizeValue
  };
  return {
    style: cleanEmptyObject(updatedStyle),
    fontFamily: fontFamilySlug,
    fontSize: fontSizeSlug
  };
}
function attributesToStyle(attributes) {
  return {
    ...attributes.style,
    typography: {
      ...attributes.style?.typography,
      fontFamily: attributes.fontFamily ? "var:preset|font-family|" + attributes.fontFamily : void 0,
      fontSize: attributes.fontSize ? "var:preset|font-size|" + attributes.fontSize : attributes.style?.typography?.fontSize
    }
  };
}
function TypographyInspectorControl({ children, resetAllFilter }) {
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
      group: "typography",
      resetAllFilter: attributesResetAllFilter,
      children
    }
  );
}
function TypographyPanel({ clientId, name, setAttributes, settings }) {
  const isEnabled = useHasTypographyPanel(settings);
  const { style, fontFamily, fontSize, fitText } = useSelect(
    (select) => {
      if (!isEnabled) {
        return {};
      }
      const {
        style: _style,
        fontFamily: _fontFamily,
        fontSize: _fontSize,
        fitText: _fitText
      } = select(blockEditorStore).getBlockAttributes(clientId) || {};
      return {
        style: _style,
        fontFamily: _fontFamily,
        fontSize: _fontSize,
        fitText: _fitText
      };
    },
    [clientId, isEnabled]
  );
  const value = useMemo(
    () => attributesToStyle({ style, fontFamily, fontSize }),
    [style, fontSize, fontFamily]
  );
  const onChange = (newStyle) => {
    const newAttributes = styleToAttributes(newStyle);
    const hasFontSize = newAttributes.fontSize || newAttributes.style?.typography?.fontSize;
    if (hasFontSize && fitText) {
      newAttributes.fitText = void 0;
    }
    setAttributes(newAttributes);
  };
  if (!isEnabled) {
    return null;
  }
  const defaultControls = getBlockSupport(name, [
    TYPOGRAPHY_SUPPORT_KEY,
    "__experimentalDefaultControls"
  ]);
  return /* @__PURE__ */ jsx(
    StylesTypographyPanel,
    {
      as: TypographyInspectorControl,
      panelId: clientId,
      settings,
      value,
      onChange,
      defaultControls
    }
  );
}
var hasTypographySupport = (blockName) => {
  return TYPOGRAPHY_SUPPORT_KEYS.some(
    (key) => hasBlockSupport(blockName, key)
  );
};
export {
  TYPOGRAPHY_SUPPORT_KEY,
  TYPOGRAPHY_SUPPORT_KEYS,
  TypographyPanel,
  hasTypographySupport
};
//# sourceMappingURL=typography.mjs.map
