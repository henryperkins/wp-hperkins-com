// packages/global-styles-ui/src/screen-block.tsx
import { getBlockType } from "@wordpress/blocks";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { useContext, useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import {
  PanelBody,
  __experimentalVStack as VStack,
  __experimentalHasSplitBorders as hasSplitBorders
} from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import {
  setStyle as setStyleHelper,
  setSetting as setSettingHelper
} from "@wordpress/global-styles-engine";
import { ScreenHeader } from "./screen-header.mjs";
import BlockPreviewPanel from "./block-preview-panel.mjs";
import { Subtitle } from "./subtitle.mjs";
import {
  useBlockVariations,
  VariationsPanel
} from "./variations/variations-panel.mjs";
import { useStyle, useSetting } from "./hooks.mjs";
import { GlobalStylesContext } from "./context.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  if (hasSplitBorders(border)) {
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
} = unlock(blockEditorPrivateApis);
function ScreenBlock({ name, variation }) {
  const { user: userConfig, onChange: onChangeGlobalStyles } = useContext(GlobalStylesContext);
  let prefixParts = [];
  if (variation) {
    prefixParts = ["variations", variation].concat(prefixParts);
  }
  const prefix = prefixParts.join(".");
  const [style] = useStyle(prefix, name, "user", false);
  const [inheritedStyle, setStyle] = useStyle(
    prefix,
    name,
    "merged",
    false
  );
  const [userSettings] = useSetting("", name, "user");
  const [rawSettings, setSettings] = useSetting("", name);
  const settingsForBlockElement = useSettingsForBlockElement(
    rawSettings,
    name
  );
  const blockType = getBlockType(name);
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
  const settings = useMemo(() => {
    const updatedSettings = structuredClone(settingsForBlockElement);
    if (disableBlockGap) {
      updatedSettings.spacing.blockGap = false;
    }
    if (disableAspectRatio) {
      updatedSettings.dimensions.aspectRatio = false;
    }
    return updatedSettings;
  }, [settingsForBlockElement, disableBlockGap, disableAspectRatio]);
  const blockVariations = useBlockVariations(name);
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
  const { canEditCSS } = useSelect((select) => {
    const { getEntityRecord, __experimentalGetCurrentGlobalStylesId } = select(coreStore);
    const globalStylesId = __experimentalGetCurrentGlobalStylesId();
    const globalStyles = globalStylesId ? getEntityRecord("root", "globalStyles", globalStylesId) : void 0;
    return {
      canEditCSS: !!globalStyles?._links?.["wp:action-edit-css"]
    };
  }, []);
  const currentBlockStyle = variation ? blockVariations.find((s) => s.name === variation) : null;
  const inheritedStyleWithLayout = useMemo(() => {
    return {
      ...inheritedStyle,
      layout: settings.layout
    };
  }, [inheritedStyle, settings.layout]);
  const styleWithLayout = useMemo(() => {
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
      let updatedConfig = setStyleHelper(
        userConfig,
        prefix,
        styleWithoutSettings,
        name
      );
      updatedConfig = setSettingHelper(
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
    const updatedBorder = !hasSplitBorders(border) ? {
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: variation ? currentBlockStyle?.label : blockType?.title
      }
    ),
    /* @__PURE__ */ jsx(BlockPreviewPanel, { name, variation }),
    hasVariationsPanel && /* @__PURE__ */ jsx("div", { className: "global-styles-ui-screen-variations", children: /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
      /* @__PURE__ */ jsx(Subtitle, { children: __("Style Variations") }),
      /* @__PURE__ */ jsx(VariationsPanel, { name })
    ] }) }),
    hasColorPanel && /* @__PURE__ */ jsx(
      StylesColorPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: setStyle,
        settings
      }
    ),
    hasBackgroundPanel && /* @__PURE__ */ jsx(
      StylesBackgroundPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: setStyle,
        settings,
        defaultValues: BACKGROUND_BLOCK_DEFAULT_VALUES
      }
    ),
    hasTypographyPanel && /* @__PURE__ */ jsx(
      StylesTypographyPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: onChangeTypography,
        settings,
        isGlobalStyles: true
      }
    ),
    hasDimensionsPanel && /* @__PURE__ */ jsx(
      StylesDimensionsPanel,
      {
        inheritedValue: inheritedStyleWithLayout,
        value: styleWithLayout,
        onChange: onChangeDimensions,
        settings,
        includeLayoutControls: true
      }
    ),
    hasBorderPanel && /* @__PURE__ */ jsx(
      StylesBorderPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: onChangeBorders,
        settings
      }
    ),
    hasFiltersPanel && /* @__PURE__ */ jsx(
      StylesFiltersPanel,
      {
        inheritedValue: inheritedStyleWithLayout,
        value: styleWithLayout,
        onChange: setStyle,
        settings,
        includeLayoutControls: true
      }
    ),
    hasImageSettingsPanel && /* @__PURE__ */ jsx(
      ImageSettingsPanel,
      {
        onChange: onChangeLightbox,
        value: userSettings,
        inheritedValue: settings
      }
    ),
    canEditCSS && /* @__PURE__ */ jsx(PanelBody, { title: __("Advanced"), initialOpen: false, children: /* @__PURE__ */ jsx(
      StylesAdvancedPanel,
      {
        value: style,
        onChange: setStyle,
        inheritedValue: inheritedStyle,
        help: sprintf(
          // translators: %s: is the name of a block e.g., 'Image' or 'Table'.
          __(
            "Add your own CSS to customize the appearance of the %s block. You do not need to include a CSS selector, just add the property and value."
          ),
          blockType?.title
        )
      }
    ) })
  ] });
}
var screen_block_default = ScreenBlock;
export {
  screen_block_default as default
};
//# sourceMappingURL=screen-block.mjs.map
