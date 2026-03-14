"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/hooks/typography.js
var typography_exports = {};
__export(typography_exports, {
  TYPOGRAPHY_SUPPORT_KEY: () => TYPOGRAPHY_SUPPORT_KEY,
  TYPOGRAPHY_SUPPORT_KEYS: () => TYPOGRAPHY_SUPPORT_KEYS,
  TypographyPanel: () => TypographyPanel,
  hasTypographySupport: () => hasTypographySupport
});
module.exports = __toCommonJS(typography_exports);
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_inspector_controls = __toESM(require("../components/inspector-controls/index.cjs"));
var import_typography_panel = __toESM(require("../components/global-styles/typography-panel.cjs"));
var import_line_height = require("./line-height.cjs");
var import_font_family = require("./font-family.cjs");
var import_font_size = require("./font-size.cjs");
var import_text_align = require("./text-align.cjs");
var import_fit_text = require("./fit-text.cjs");
var import_utils = require("./utils.cjs");
var import_store = require("../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  import_line_height.LINE_HEIGHT_SUPPORT_KEY,
  import_font_size.FONT_SIZE_SUPPORT_KEY,
  FONT_STYLE_SUPPORT_KEY,
  FONT_WEIGHT_SUPPORT_KEY,
  import_font_family.FONT_FAMILY_SUPPORT_KEY,
  import_text_align.TEXT_ALIGN_SUPPORT_KEY,
  TEXT_COLUMNS_SUPPORT_KEY,
  TEXT_DECORATION_SUPPORT_KEY,
  TEXT_INDENT_SUPPORT_KEY,
  WRITING_MODE_SUPPORT_KEY,
  TEXT_TRANSFORM_SUPPORT_KEY,
  LETTER_SPACING_SUPPORT_KEY,
  import_fit_text.FIT_TEXT_SUPPORT_KEY
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
    style: (0, import_utils.cleanEmptyObject)(updatedStyle),
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
  const attributesResetAllFilter = (0, import_element.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_inspector_controls.default,
    {
      group: "typography",
      resetAllFilter: attributesResetAllFilter,
      children
    }
  );
}
function TypographyPanel({ clientId, name, setAttributes, settings }) {
  const isEnabled = (0, import_typography_panel.useHasTypographyPanel)(settings);
  const { style, fontFamily, fontSize, fitText } = (0, import_data.useSelect)(
    (select) => {
      if (!isEnabled) {
        return {};
      }
      const {
        style: _style,
        fontFamily: _fontFamily,
        fontSize: _fontSize,
        fitText: _fitText
      } = select(import_store.store).getBlockAttributes(clientId) || {};
      return {
        style: _style,
        fontFamily: _fontFamily,
        fontSize: _fontSize,
        fitText: _fitText
      };
    },
    [clientId, isEnabled]
  );
  const value = (0, import_element.useMemo)(
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
  const defaultControls = (0, import_blocks.getBlockSupport)(name, [
    TYPOGRAPHY_SUPPORT_KEY,
    "__experimentalDefaultControls"
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_typography_panel.default,
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
    (key) => (0, import_blocks.hasBlockSupport)(blockName, key)
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TYPOGRAPHY_SUPPORT_KEY,
  TYPOGRAPHY_SUPPORT_KEYS,
  TypographyPanel,
  hasTypographySupport
});
//# sourceMappingURL=typography.cjs.map
