// packages/block-editor/src/components/global-styles/typography-panel.js
import {
  FontSizePicker,
  __experimentalNumberControl as NumberControl,
  __experimentalToolsPanel as ToolsPanel,
  __experimentalToolsPanelItem as ToolsPanelItem,
  Notice,
  ToggleControl
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useCallback, useMemo } from "@wordpress/element";
import { getValueFromVariable } from "@wordpress/global-styles-engine";
import FontFamilyControl from "../font-family/index.mjs";
import FontAppearanceControl from "../font-appearance-control/index.mjs";
import LineHeightControl from "../line-height-control/index.mjs";
import LetterSpacingControl from "../letter-spacing-control/index.mjs";
import TextAlignmentControl from "../text-alignment-control/index.mjs";
import TextTransformControl from "../text-transform-control/index.mjs";
import TextDecorationControl from "../text-decoration-control/index.mjs";
import TextIndentControl from "../text-indent-control/index.mjs";
import WritingModeControl from "../writing-mode-control/index.mjs";
import { useToolsPanelDropdownMenuProps } from "./utils.mjs";
import { setImmutably } from "../../utils/object.mjs";
import {
  getMergedFontFamiliesAndFontFamilyFaces,
  findNearestStyleAndWeight
} from "./typography-utils.mjs";
import { getFontStylesAndWeights } from "../../utils/get-font-styles-and-weights.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var MIN_TEXT_COLUMNS = 1;
var MAX_TEXT_COLUMNS = 6;
function useHasTypographyPanel(settings) {
  const hasFontFamily = useHasFontFamilyControl(settings);
  const hasLineHeight = useHasLineHeightControl(settings);
  const hasFontAppearance = useHasAppearanceControl(settings);
  const hasLetterSpacing = useHasLetterSpacingControl(settings);
  const hasTextAlign = useHasTextAlignmentControl(settings);
  const hasTextTransform = useHasTextTransformControl(settings);
  const hasTextDecoration = useHasTextDecorationControl(settings);
  const hasTextIndent = useHasTextIndentControl(settings);
  const hasWritingMode = useHasWritingModeControl(settings);
  const hasTextColumns = useHasTextColumnsControl(settings);
  const hasFontSize = useHasFontSizeControl(settings);
  return hasFontFamily || hasLineHeight || hasFontAppearance || hasLetterSpacing || hasTextAlign || hasTextTransform || hasFontSize || hasTextDecoration || hasTextIndent || hasWritingMode || hasTextColumns;
}
function useHasFontSizeControl(settings) {
  return settings?.typography?.defaultFontSizes !== false && settings?.typography?.fontSizes?.default?.length || settings?.typography?.fontSizes?.theme?.length || settings?.typography?.fontSizes?.custom?.length || settings?.typography?.customFontSize;
}
function useHasFontFamilyControl(settings) {
  return ["default", "theme", "custom"].some(
    (key) => settings?.typography?.fontFamilies?.[key]?.length
  );
}
function useHasLineHeightControl(settings) {
  return settings?.typography?.lineHeight;
}
function useHasAppearanceControl(settings) {
  return settings?.typography?.fontStyle || settings?.typography?.fontWeight;
}
function useAppearanceControlLabel(settings) {
  if (!settings?.typography?.fontStyle) {
    return __("Font weight");
  }
  if (!settings?.typography?.fontWeight) {
    return __("Font style");
  }
  return __("Appearance");
}
function useHasLetterSpacingControl(settings) {
  return settings?.typography?.letterSpacing;
}
function useHasTextTransformControl(settings) {
  return settings?.typography?.textTransform;
}
function useHasTextAlignmentControl(settings) {
  return settings?.typography?.textAlign;
}
function useHasTextDecorationControl(settings) {
  return settings?.typography?.textDecoration;
}
function useHasWritingModeControl(settings) {
  return settings?.typography?.writingMode;
}
function useHasTextColumnsControl(settings) {
  return settings?.typography?.textColumns;
}
function useHasTextIndentControl(settings) {
  return settings?.typography?.textIndent;
}
function getMergedFontSizes(settings) {
  const fontSizes = settings?.typography?.fontSizes;
  const defaultFontSizesEnabled = !!settings?.typography?.defaultFontSizes;
  return [
    ...fontSizes?.custom ?? [],
    ...fontSizes?.theme ?? [],
    ...defaultFontSizesEnabled ? fontSizes?.default ?? [] : []
  ];
}
function TypographyToolsPanel({
  resetAllFilter,
  onChange,
  value,
  panelId,
  children
}) {
  const dropdownMenuProps = useToolsPanelDropdownMenuProps();
  const resetAll = () => {
    const updatedValue = resetAllFilter(value);
    onChange(updatedValue);
  };
  return /* @__PURE__ */ jsx(
    ToolsPanel,
    {
      label: __("Typography"),
      resetAll,
      panelId,
      dropdownMenuProps,
      children
    }
  );
}
var DEFAULT_CONTROLS = {
  fontFamily: true,
  fontSize: true,
  fontAppearance: true,
  lineHeight: true,
  letterSpacing: true,
  textAlign: true,
  textTransform: true,
  textDecoration: true,
  textIndent: true,
  writingMode: true,
  textColumns: true
};
function TypographyPanel({
  as: Wrapper = TypographyToolsPanel,
  value,
  onChange,
  inheritedValue = value,
  settings,
  panelId,
  defaultControls = DEFAULT_CONTROLS,
  isGlobalStyles = false
}) {
  const decodeValue = (rawValue) => getValueFromVariable({ settings }, "", rawValue);
  const hasFontFamilyEnabled = useHasFontFamilyControl(settings);
  const fontFamily = decodeValue(inheritedValue?.typography?.fontFamily);
  const { fontFamilies, fontFamilyFaces } = useMemo(() => {
    return getMergedFontFamiliesAndFontFamilyFaces(settings, fontFamily);
  }, [settings, fontFamily]);
  const setFontFamily = (newValue) => {
    const slug = fontFamilies?.find(
      ({ fontFamily: f }) => f === newValue
    )?.slug;
    let updatedValue = setImmutably(
      value,
      ["typography", "fontFamily"],
      slug ? `var:preset|font-family|${slug}` : newValue || void 0
    );
    const newFontFamilyFaces = fontFamilies?.find(({ fontFamily: f }) => f === newValue)?.fontFace ?? [];
    const { fontStyles, fontWeights } = getFontStylesAndWeights(newFontFamilyFaces);
    const hasFontStyle = fontStyles?.some(
      ({ value: fs }) => fs === fontStyle
    );
    const hasFontWeight = fontWeights?.some(
      ({ value: fw }) => fw?.toString() === fontWeight?.toString()
    );
    if (!hasFontStyle || !hasFontWeight) {
      const { nearestFontStyle, nearestFontWeight } = findNearestStyleAndWeight(
        newFontFamilyFaces,
        fontStyle,
        fontWeight
      );
      if (nearestFontStyle || nearestFontWeight) {
        updatedValue = {
          ...updatedValue,
          typography: {
            ...updatedValue?.typography,
            fontStyle: nearestFontStyle || void 0,
            fontWeight: nearestFontWeight || void 0
          }
        };
      } else if (fontStyle || fontWeight) {
        updatedValue = {
          ...updatedValue,
          typography: {
            ...updatedValue?.typography,
            fontStyle: void 0,
            fontWeight: void 0
          }
        };
      }
    }
    onChange(updatedValue);
  };
  const hasFontFamily = () => !!value?.typography?.fontFamily;
  const resetFontFamily = () => setFontFamily(void 0);
  const hasFontSizeEnabled = useHasFontSizeControl(settings);
  const disableCustomFontSizes = !settings?.typography?.customFontSize;
  const mergedFontSizes = getMergedFontSizes(settings);
  const fontSize = decodeValue(inheritedValue?.typography?.fontSize);
  const currentFontSizeSlug = (() => {
    const rawValue = inheritedValue?.typography?.fontSize;
    if (!rawValue || typeof rawValue !== "string") {
      return void 0;
    }
    if (rawValue.startsWith("var:preset|font-size|")) {
      return rawValue.replace("var:preset|font-size|", "");
    }
    const cssVarMatch = rawValue.match(
      /^var\(--wp--preset--font-size--([^)]+)\)$/
    );
    if (cssVarMatch) {
      return cssVarMatch[1];
    }
    return void 0;
  })();
  const setFontSize = (newValue, metadata) => {
    const actualValue = !!metadata?.slug ? `var:preset|font-size|${metadata?.slug}` : newValue;
    onChange(
      setImmutably(
        value,
        ["typography", "fontSize"],
        actualValue || void 0
      )
    );
  };
  const hasFontSize = () => !!value?.typography?.fontSize;
  const resetFontSize = () => setFontSize(void 0);
  const hasAppearanceControl = useHasAppearanceControl(settings);
  const appearanceControlLabel = useAppearanceControlLabel(settings);
  const hasFontStyles = settings?.typography?.fontStyle;
  const hasFontWeights = settings?.typography?.fontWeight;
  const fontStyle = decodeValue(inheritedValue?.typography?.fontStyle);
  const fontWeight = decodeValue(inheritedValue?.typography?.fontWeight);
  const setFontAppearance = useCallback(
    ({ fontStyle: newFontStyle, fontWeight: newFontWeight }) => {
      if (newFontStyle !== fontStyle || newFontWeight !== fontWeight) {
        onChange({
          ...value,
          typography: {
            ...value?.typography,
            fontStyle: newFontStyle || void 0,
            fontWeight: newFontWeight || void 0
          }
        });
      }
    },
    [fontStyle, fontWeight, onChange, value]
  );
  const hasFontAppearance = () => !!value?.typography?.fontStyle || !!value?.typography?.fontWeight;
  const resetFontAppearance = useCallback(() => {
    setFontAppearance({});
  }, [setFontAppearance]);
  const hasLineHeightEnabled = useHasLineHeightControl(settings);
  const lineHeight = decodeValue(inheritedValue?.typography?.lineHeight);
  const setLineHeight = (newValue) => {
    onChange(
      setImmutably(
        value,
        ["typography", "lineHeight"],
        newValue || void 0
      )
    );
  };
  const hasLineHeight = () => value?.typography?.lineHeight !== void 0;
  const resetLineHeight = () => setLineHeight(void 0);
  const hasLetterSpacingControl = useHasLetterSpacingControl(settings);
  const letterSpacing = decodeValue(
    inheritedValue?.typography?.letterSpacing
  );
  const setLetterSpacing = (newValue) => {
    onChange(
      setImmutably(
        value,
        ["typography", "letterSpacing"],
        newValue || void 0
      )
    );
  };
  const hasLetterSpacing = () => !!value?.typography?.letterSpacing;
  const resetLetterSpacing = () => setLetterSpacing(void 0);
  const hasTextIndentControl = useHasTextIndentControl(settings);
  const textIndent = decodeValue(inheritedValue?.typography?.textIndent);
  const textIndentSetting = settings?.typography?.textIndent ?? "subsequent";
  const isTextIndentAll = textIndentSetting === "all";
  const setTextIndentValue = (newValue) => {
    onChange(
      setImmutably(
        value,
        ["typography", "textIndent"],
        newValue || void 0
      )
    );
  };
  const onToggleTextIndentAll = (newValue) => {
    onChange({
      ...value,
      settings: {
        typography: {
          textIndent: newValue ? "all" : "subsequent"
        }
      }
    });
  };
  const hasTextIndent = () => !!value?.typography?.textIndent;
  const resetTextIndent = () => {
    onChange(
      setImmutably(value, ["typography", "textIndent"], void 0)
    );
  };
  const textIndentHelp = isTextIndentAll ? __("Indents the first line of all paragraphs.") : __("Indents the first line of each paragraph after the first one.");
  const hasTextColumnsControl = useHasTextColumnsControl(settings);
  const textColumns = decodeValue(inheritedValue?.typography?.textColumns);
  const setTextColumns = (newValue) => {
    onChange(
      setImmutably(
        value,
        ["typography", "textColumns"],
        newValue || void 0
      )
    );
  };
  const hasTextColumns = () => !!value?.typography?.textColumns;
  const resetTextColumns = () => setTextColumns(void 0);
  const hasTextTransformControl = useHasTextTransformControl(settings);
  const textTransform = decodeValue(
    inheritedValue?.typography?.textTransform
  );
  const setTextTransform = (newValue) => {
    onChange(
      setImmutably(
        value,
        ["typography", "textTransform"],
        newValue || void 0
      )
    );
  };
  const hasTextTransform = () => !!value?.typography?.textTransform;
  const resetTextTransform = () => setTextTransform(void 0);
  const hasTextDecorationControl = useHasTextDecorationControl(settings);
  const textDecoration = decodeValue(
    inheritedValue?.typography?.textDecoration
  );
  const setTextDecoration = (newValue) => {
    onChange(
      setImmutably(
        value,
        ["typography", "textDecoration"],
        newValue || void 0
      )
    );
  };
  const hasTextDecoration = () => !!value?.typography?.textDecoration;
  const resetTextDecoration = () => setTextDecoration(void 0);
  const hasWritingModeControl = useHasWritingModeControl(settings);
  const writingMode = decodeValue(inheritedValue?.typography?.writingMode);
  const setWritingMode = (newValue) => {
    onChange(
      setImmutably(
        value,
        ["typography", "writingMode"],
        newValue || void 0
      )
    );
  };
  const hasWritingMode = () => !!value?.typography?.writingMode;
  const resetWritingMode = () => setWritingMode(void 0);
  const hasTextAlignmentControl = useHasTextAlignmentControl(settings);
  const textAlign = decodeValue(inheritedValue?.typography?.textAlign);
  const setTextAlign = (newValue) => {
    onChange(
      setImmutably(
        value,
        ["typography", "textAlign"],
        newValue || void 0
      )
    );
  };
  const hasTextAlign = () => !!value?.typography?.textAlign;
  const resetTextAlign = () => setTextAlign(void 0);
  const resetAllFilter = useCallback((previousValue) => {
    return {
      ...previousValue,
      typography: {}
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    Wrapper,
    {
      resetAllFilter,
      value,
      onChange,
      panelId,
      children: [
        hasFontFamilyEnabled && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Font"),
            hasValue: hasFontFamily,
            onDeselect: resetFontFamily,
            isShownByDefault: defaultControls.fontFamily,
            panelId,
            children: /* @__PURE__ */ jsx(
              FontFamilyControl,
              {
                fontFamilies,
                value: fontFamily,
                onChange: setFontFamily,
                size: "__unstable-large"
              }
            )
          }
        ),
        hasFontSizeEnabled && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Size"),
            hasValue: hasFontSize,
            onDeselect: resetFontSize,
            isShownByDefault: defaultControls.fontSize,
            panelId,
            children: /* @__PURE__ */ jsx(
              FontSizePicker,
              {
                value: currentFontSizeSlug || fontSize,
                valueMode: currentFontSizeSlug ? "slug" : "literal",
                onChange: setFontSize,
                fontSizes: mergedFontSizes,
                disableCustomFontSizes,
                withReset: false,
                withSlider: true,
                size: "__unstable-large"
              }
            )
          }
        ),
        hasAppearanceControl && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: appearanceControlLabel,
            hasValue: hasFontAppearance,
            onDeselect: resetFontAppearance,
            isShownByDefault: defaultControls.fontAppearance,
            panelId,
            children: /* @__PURE__ */ jsx(
              FontAppearanceControl,
              {
                value: {
                  fontStyle,
                  fontWeight
                },
                onChange: setFontAppearance,
                hasFontStyles,
                hasFontWeights,
                fontFamilyFaces,
                size: "__unstable-large"
              }
            )
          }
        ),
        hasLineHeightEnabled && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            className: "single-column",
            label: __("Line height"),
            hasValue: hasLineHeight,
            onDeselect: resetLineHeight,
            isShownByDefault: defaultControls.lineHeight,
            panelId,
            children: /* @__PURE__ */ jsx(
              LineHeightControl,
              {
                __unstableInputWidth: "auto",
                value: lineHeight,
                onChange: setLineHeight,
                size: "__unstable-large"
              }
            )
          }
        ),
        hasLetterSpacingControl && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            className: "single-column",
            label: __("Letter spacing"),
            hasValue: hasLetterSpacing,
            onDeselect: resetLetterSpacing,
            isShownByDefault: defaultControls.letterSpacing,
            panelId,
            children: /* @__PURE__ */ jsx(
              LetterSpacingControl,
              {
                value: letterSpacing,
                onChange: setLetterSpacing,
                size: "__unstable-large",
                __unstableInputWidth: "auto"
              }
            )
          }
        ),
        hasTextIndentControl && /* @__PURE__ */ jsxs(
          ToolsPanelItem,
          {
            label: __("Line indent"),
            hasValue: hasTextIndent,
            onDeselect: resetTextIndent,
            isShownByDefault: defaultControls.textIndent,
            panelId,
            children: [
              /* @__PURE__ */ jsx(
                TextIndentControl,
                {
                  value: textIndent,
                  onChange: setTextIndentValue,
                  size: "__unstable-large",
                  __unstableInputWidth: "auto",
                  withSlider: true,
                  hasBottomMargin: isGlobalStyles
                }
              ),
              isGlobalStyles && /* @__PURE__ */ jsx(
                ToggleControl,
                {
                  label: __("Indent all paragraphs"),
                  checked: isTextIndentAll,
                  onChange: onToggleTextIndentAll,
                  help: textIndentHelp
                }
              )
            ]
          }
        ),
        hasTextColumnsControl && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            className: "single-column",
            label: __("Columns"),
            hasValue: hasTextColumns,
            onDeselect: resetTextColumns,
            isShownByDefault: defaultControls.textColumns,
            panelId,
            children: /* @__PURE__ */ jsx(
              NumberControl,
              {
                label: __("Columns"),
                max: MAX_TEXT_COLUMNS,
                min: MIN_TEXT_COLUMNS,
                onChange: setTextColumns,
                size: "__unstable-large",
                spinControls: "custom",
                value: textColumns,
                initialPosition: 1
              }
            )
          }
        ),
        hasTextDecorationControl && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            className: "single-column",
            label: __("Decoration"),
            hasValue: hasTextDecoration,
            onDeselect: resetTextDecoration,
            isShownByDefault: defaultControls.textDecoration,
            panelId,
            children: /* @__PURE__ */ jsx(
              TextDecorationControl,
              {
                value: textDecoration,
                onChange: setTextDecoration,
                size: "__unstable-large",
                __unstableInputWidth: "auto"
              }
            )
          }
        ),
        hasWritingModeControl && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            className: "single-column",
            label: __("Orientation"),
            hasValue: hasWritingMode,
            onDeselect: resetWritingMode,
            isShownByDefault: defaultControls.writingMode,
            panelId,
            children: /* @__PURE__ */ jsx(
              WritingModeControl,
              {
                value: writingMode,
                onChange: setWritingMode,
                size: "__unstable-large"
              }
            )
          }
        ),
        hasTextTransformControl && /* @__PURE__ */ jsx(
          ToolsPanelItem,
          {
            label: __("Letter case"),
            hasValue: hasTextTransform,
            onDeselect: resetTextTransform,
            isShownByDefault: defaultControls.textTransform,
            panelId,
            children: /* @__PURE__ */ jsx(
              TextTransformControl,
              {
                value: textTransform,
                onChange: setTextTransform,
                showNone: true,
                isBlock: true,
                size: "__unstable-large"
              }
            )
          }
        ),
        hasTextAlignmentControl && /* @__PURE__ */ jsxs(
          ToolsPanelItem,
          {
            label: __("Text alignment"),
            hasValue: hasTextAlign,
            onDeselect: resetTextAlign,
            isShownByDefault: defaultControls.textAlign,
            panelId,
            children: [
              /* @__PURE__ */ jsx(
                TextAlignmentControl,
                {
                  value: textAlign,
                  onChange: setTextAlign,
                  options: ["left", "center", "right", "justify"],
                  size: "__unstable-large"
                }
              ),
              textAlign === "justify" && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Notice, { status: "warning", isDismissible: false, children: __(
                "Justified text can reduce readability. For better accessibility, use left-aligned text instead."
              ) }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  TypographyPanel as default,
  useHasTypographyPanel
};
//# sourceMappingURL=typography-panel.mjs.map
