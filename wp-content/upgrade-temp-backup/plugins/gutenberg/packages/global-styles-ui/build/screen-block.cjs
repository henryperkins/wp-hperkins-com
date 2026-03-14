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

// packages/global-styles-ui/src/screen-block.tsx
var screen_block_exports = {};
__export(screen_block_exports, {
  default: () => screen_block_default
});
module.exports = __toCommonJS(screen_block_exports);
var import_blocks = require("@wordpress/blocks");
var import_block_editor = require("@wordpress/block-editor");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_screen_header = require("./screen-header.cjs");
var import_block_preview_panel = __toESM(require("./block-preview-panel.cjs"));
var import_subtitle = require("./subtitle.cjs");
var import_variations_panel = require("./variations/variations-panel.cjs");
var import_hooks = require("./hooks.cjs");
var import_context = require("./context.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var BACKGROUND_BLOCK_DEFAULT_VALUES = {
  backgroundSize: "cover",
  backgroundPosition: "50% 50%"
  // used only when backgroundSize is 'contain'.
};
function applyFallbackStyle(border) {
  if (!border) {
    return border;
  }
  const hasColorOrWidth = border.color || border.width;
  if (!border.style && hasColorOrWidth) {
    return { ...border, style: "solid" };
  }
  if (border.style && !hasColorOrWidth) {
    return void 0;
  }
  return border;
}
function applyAllFallbackStyles(border) {
  if (!border) {
    return border;
  }
  if ((0, import_components.__experimentalHasSplitBorders)(border)) {
    return {
      top: applyFallbackStyle(border.top),
      right: applyFallbackStyle(border.right),
      bottom: applyFallbackStyle(border.bottom),
      left: applyFallbackStyle(border.left)
    };
  }
  return applyFallbackStyle(border);
}
var {
  useHasDimensionsPanel,
  useHasTypographyPanel,
  useHasBorderPanel,
  useSettingsForBlockElement,
  useHasColorPanel,
  useHasFiltersPanel,
  useHasImageSettingsPanel,
  useHasBackgroundPanel,
  BackgroundPanel: StylesBackgroundPanel,
  BorderPanel: StylesBorderPanel,
  ColorPanel: StylesColorPanel,
  TypographyPanel: StylesTypographyPanel,
  DimensionsPanel: StylesDimensionsPanel,
  FiltersPanel: StylesFiltersPanel,
  ImageSettingsPanel,
  AdvancedPanel: StylesAdvancedPanel
} = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function ScreenBlock({ name, variation }) {
  const { user: userConfig, onChange: onChangeGlobalStyles } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  let prefixParts = [];
  if (variation) {
    prefixParts = ["variations", variation].concat(prefixParts);
  }
  const prefix = prefixParts.join(".");
  const [style] = (0, import_hooks.useStyle)(prefix, name, "user", false);
  const [inheritedStyle, setStyle] = (0, import_hooks.useStyle)(
    prefix,
    name,
    "merged",
    false
  );
  const [userSettings] = (0, import_hooks.useSetting)("", name, "user");
  const [rawSettings, setSettings] = (0, import_hooks.useSetting)("", name);
  const settingsForBlockElement = useSettingsForBlockElement(
    rawSettings,
    name
  );
  const blockType = (0, import_blocks.getBlockType)(name);
  let disableBlockGap = false;
  if (settingsForBlockElement?.spacing?.blockGap && blockType?.supports?.spacing?.blockGap && (blockType?.supports?.spacing?.__experimentalSkipSerialization === true || blockType?.supports?.spacing?.__experimentalSkipSerialization?.some?.(
    (spacingType) => spacingType === "blockGap"
  ))) {
    disableBlockGap = true;
  }
  let disableAspectRatio = false;
  if (settingsForBlockElement?.dimensions?.aspectRatio && name === "core/group") {
    disableAspectRatio = true;
  }
  const settings = (0, import_element.useMemo)(() => {
    const updatedSettings = structuredClone(settingsForBlockElement);
    if (disableBlockGap) {
      updatedSettings.spacing.blockGap = false;
    }
    if (disableAspectRatio) {
      updatedSettings.dimensions.aspectRatio = false;
    }
    return updatedSettings;
  }, [settingsForBlockElement, disableBlockGap, disableAspectRatio]);
  const blockVariations = (0, import_variations_panel.useBlockVariations)(name);
  const hasBackgroundPanel = useHasBackgroundPanel(settings);
  const hasTypographyPanel = useHasTypographyPanel(settings);
  const hasColorPanel = useHasColorPanel(settings);
  const hasBorderPanel = useHasBorderPanel(settings);
  const hasDimensionsPanel = useHasDimensionsPanel(settings);
  const hasFiltersPanel = useHasFiltersPanel(settings);
  const hasImageSettingsPanel = useHasImageSettingsPanel(
    name,
    userSettings,
    settings
  );
  const hasVariationsPanel = !!blockVariations?.length && !variation;
  const { canEditCSS } = (0, import_data.useSelect)((select) => {
    const { getEntityRecord, __experimentalGetCurrentGlobalStylesId } = select(import_core_data.store);
    const globalStylesId = __experimentalGetCurrentGlobalStylesId();
    const globalStyles = globalStylesId ? getEntityRecord("root", "globalStyles", globalStylesId) : void 0;
    return {
      canEditCSS: !!globalStyles?._links?.["wp:action-edit-css"]
    };
  }, []);
  const currentBlockStyle = variation ? blockVariations.find((s) => s.name === variation) : null;
  const inheritedStyleWithLayout = (0, import_element.useMemo)(() => {
    return {
      ...inheritedStyle,
      layout: settings.layout
    };
  }, [inheritedStyle, settings.layout]);
  const styleWithLayout = (0, import_element.useMemo)(() => {
    return {
      ...style,
      layout: userSettings.layout
    };
  }, [style, userSettings.layout]);
  const onChangeDimensions = (newStyle) => {
    const updatedStyle = { ...newStyle };
    delete updatedStyle.layout;
    setStyle(updatedStyle);
    if (newStyle.layout !== userSettings.layout) {
      setSettings({
        ...userSettings,
        layout: newStyle.layout
      });
    }
  };
  const onChangeLightbox = (newSetting) => {
    if (newSetting === void 0) {
      setSettings({
        ...rawSettings,
        lightbox: void 0
      });
    } else {
      setSettings({
        ...rawSettings,
        lightbox: {
          ...rawSettings.lightbox,
          ...newSetting
        }
      });
    }
  };
  const onChangeTypography = (newStyle) => {
    const { settings: newSettings, ...styleWithoutSettings } = newStyle;
    if (newSettings?.typography) {
      let updatedConfig = (0, import_global_styles_engine.setStyle)(
        userConfig,
        prefix,
        styleWithoutSettings,
        name
      );
      updatedConfig = (0, import_global_styles_engine.setSetting)(
        updatedConfig,
        "typography",
        {
          ...userSettings.typography,
          ...newSettings.typography
        },
        name
      );
      onChangeGlobalStyles(updatedConfig);
    } else {
      setStyle(styleWithoutSettings);
    }
  };
  const onChangeBorders = (newStyle) => {
    if (!newStyle?.border) {
      setStyle(newStyle);
      return;
    }
    const { radius, ...newBorder } = newStyle.border;
    const border = applyAllFallbackStyles(newBorder);
    const updatedBorder = !(0, import_components.__experimentalHasSplitBorders)(border) ? {
      top: border,
      right: border,
      bottom: border,
      left: border
    } : {
      color: null,
      style: null,
      width: null,
      ...border
    };
    setStyle({ ...newStyle, border: { ...updatedBorder, radius } });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_screen_header.ScreenHeader,
      {
        title: variation ? currentBlockStyle?.label : blockType?.title
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_preview_panel.default, { name, variation }),
    hasVariationsPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "global-styles-ui-screen-variations", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 3, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { children: (0, import_i18n.__)("Style Variations") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_variations_panel.VariationsPanel, { name })
    ] }) }),
    hasColorPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StylesColorPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: setStyle,
        settings
      }
    ),
    hasBackgroundPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StylesBackgroundPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: setStyle,
        settings,
        defaultValues: BACKGROUND_BLOCK_DEFAULT_VALUES
      }
    ),
    hasTypographyPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StylesTypographyPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: onChangeTypography,
        settings,
        isGlobalStyles: true
      }
    ),
    hasDimensionsPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StylesDimensionsPanel,
      {
        inheritedValue: inheritedStyleWithLayout,
        value: styleWithLayout,
        onChange: onChangeDimensions,
        settings,
        includeLayoutControls: true
      }
    ),
    hasBorderPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StylesBorderPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: onChangeBorders,
        settings
      }
    ),
    hasFiltersPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StylesFiltersPanel,
      {
        inheritedValue: inheritedStyleWithLayout,
        value: styleWithLayout,
        onChange: setStyle,
        settings,
        includeLayoutControls: true
      }
    ),
    hasImageSettingsPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      ImageSettingsPanel,
      {
        onChange: onChangeLightbox,
        value: userSettings,
        inheritedValue: settings
      }
    ),
    canEditCSS && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelBody, { title: (0, import_i18n.__)("Advanced"), initialOpen: false, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      StylesAdvancedPanel,
      {
        value: style,
        onChange: setStyle,
        inheritedValue: inheritedStyle,
        help: (0, import_i18n.sprintf)(
          // translators: %s: is the name of a block e.g., 'Image' or 'Table'.
          (0, import_i18n.__)(
            "Add your own CSS to customize the appearance of the %s block. You do not need to include a CSS selector, just add the property and value."
          ),
          blockType?.title
        )
      }
    ) })
  ] });
}
var screen_block_default = ScreenBlock;
//# sourceMappingURL=screen-block.cjs.map
