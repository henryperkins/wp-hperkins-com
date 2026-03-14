// packages/global-styles-ui/src/hooks.ts
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import { useCallback, useContext, useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import {
  getStyle,
  setStyle,
  getSetting,
  setSetting,
  mergeGlobalStyles
} from "@wordpress/global-styles-engine";
import { GlobalStylesContext } from "./context.mjs";
import { removePropertiesFromObject, isVariationWithProperties } from "./utils.mjs";
extend([a11yPlugin]);
function useStyle(path, blockName, readFrom = "merged", shouldDecodeEncode = true) {
  const { user, base, merged, onChange } = useContext(GlobalStylesContext);
  let sourceValue = merged;
  if (readFrom === "base") {
    sourceValue = base;
  } else if (readFrom === "user") {
    sourceValue = user;
  }
  const styleValue = useMemo(
    () => getStyle(sourceValue, path, blockName, shouldDecodeEncode),
    [sourceValue, path, blockName, shouldDecodeEncode]
  );
  const setStyleValue = useCallback(
    (newValue) => {
      const newGlobalStyles = setStyle(
        user,
        path,
        newValue,
        blockName
      );
      onChange(newGlobalStyles);
    },
    [user, onChange, path, blockName]
  );
  return [styleValue, setStyleValue];
}
function useSetting(path, blockName, readFrom = "merged") {
  const { user, base, merged, onChange } = useContext(GlobalStylesContext);
  let sourceValue = merged;
  if (readFrom === "base") {
    sourceValue = base;
  } else if (readFrom === "user") {
    sourceValue = user;
  }
  const settingValue = useMemo(
    () => getSetting(sourceValue, path, blockName),
    [sourceValue, path, blockName]
  );
  const setSettingValue = useCallback(
    (newValue) => {
      const newGlobalStyles = setSetting(
        user,
        path,
        newValue,
        blockName
      );
      onChange(newGlobalStyles);
    },
    [user, onChange, path, blockName]
  );
  return [settingValue, setSettingValue];
}
var EMPTY_ARRAY = [];
function hasThemeVariation({
  title,
  settings,
  styles
}) {
  return title === __("Default") || Object.keys(settings || {}).length > 0 || Object.keys(styles || {}).length > 0;
}
function useCurrentMergeThemeStyleVariationsWithUserConfig(properties = []) {
  const { variationsFromTheme } = useSelect((select) => {
    const _variationsFromTheme = select(
      coreStore
    ).__experimentalGetCurrentThemeGlobalStylesVariations?.();
    return {
      variationsFromTheme: _variationsFromTheme || EMPTY_ARRAY
    };
  }, []);
  const { user: userVariation } = useContext(GlobalStylesContext);
  return useMemo(() => {
    const clonedUserVariation = structuredClone(userVariation);
    const userVariationWithoutProperties = removePropertiesFromObject(
      clonedUserVariation,
      properties
    );
    userVariationWithoutProperties.title = __("Default");
    const variationsWithPropertiesAndBase = variationsFromTheme.filter((variation) => {
      return isVariationWithProperties(variation, properties);
    }).map((variation) => {
      return mergeGlobalStyles(
        userVariationWithoutProperties,
        variation
      );
    });
    const variationsByProperties = [
      userVariationWithoutProperties,
      ...variationsWithPropertiesAndBase
    ];
    return variationsByProperties?.length ? variationsByProperties.filter(hasThemeVariation) : [];
  }, [properties, userVariation, variationsFromTheme]);
}
var propertiesToFilter = ["color"];
function useColorVariations() {
  return useCurrentMergeThemeStyleVariationsWithUserConfig(
    propertiesToFilter
  );
}
function useColorRandomizer(blockName) {
  const [themeColors, setThemeColors] = useSetting(
    "color.palette.theme",
    blockName
  );
  const randomizeColors = useCallback(() => {
    if (!themeColors || !themeColors.length) {
      return;
    }
    const randomRotationValue = Math.floor(Math.random() * 225);
    const newColors = themeColors.map((colorObject) => {
      const { color } = colorObject;
      const newColor = colord(color).rotate(randomRotationValue).toHex();
      return {
        ...colorObject,
        color: newColor
      };
    });
    setThemeColors(newColors);
  }, [themeColors, setThemeColors]);
  return window.__experimentalEnableColorRandomizer ? [randomizeColors] : [];
}
export {
  useColorRandomizer,
  useColorVariations,
  useCurrentMergeThemeStyleVariationsWithUserConfig,
  useSetting,
  useStyle
};
//# sourceMappingURL=hooks.mjs.map
