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

// packages/global-styles-ui/src/hooks.ts
var hooks_exports = {};
__export(hooks_exports, {
  useColorRandomizer: () => useColorRandomizer,
  useColorVariations: () => useColorVariations,
  useCurrentMergeThemeStyleVariationsWithUserConfig: () => useCurrentMergeThemeStyleVariationsWithUserConfig,
  useSetting: () => useSetting,
  useStyle: () => useStyle
});
module.exports = __toCommonJS(hooks_exports);
var import_colord = require("colord");
var import_a11y = __toESM(require("colord/plugins/a11y"));
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_i18n = require("@wordpress/i18n");
var import_global_styles_engine = require("@wordpress/global-styles-engine");
var import_context = require("./context.cjs");
var import_utils = require("./utils.cjs");
(0, import_colord.extend)([import_a11y.default]);
function useStyle(path, blockName, readFrom = "merged", shouldDecodeEncode = true) {
  const { user, base, merged, onChange } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  let sourceValue = merged;
  if (readFrom === "base") {
    sourceValue = base;
  } else if (readFrom === "user") {
    sourceValue = user;
  }
  const styleValue = (0, import_element.useMemo)(
    () => (0, import_global_styles_engine.getStyle)(sourceValue, path, blockName, shouldDecodeEncode),
    [sourceValue, path, blockName, shouldDecodeEncode]
  );
  const setStyleValue = (0, import_element.useCallback)(
    (newValue) => {
      const newGlobalStyles = (0, import_global_styles_engine.setStyle)(
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
  const { user, base, merged, onChange } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  let sourceValue = merged;
  if (readFrom === "base") {
    sourceValue = base;
  } else if (readFrom === "user") {
    sourceValue = user;
  }
  const settingValue = (0, import_element.useMemo)(
    () => (0, import_global_styles_engine.getSetting)(sourceValue, path, blockName),
    [sourceValue, path, blockName]
  );
  const setSettingValue = (0, import_element.useCallback)(
    (newValue) => {
      const newGlobalStyles = (0, import_global_styles_engine.setSetting)(
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
  return title === (0, import_i18n.__)("Default") || Object.keys(settings || {}).length > 0 || Object.keys(styles || {}).length > 0;
}
function useCurrentMergeThemeStyleVariationsWithUserConfig(properties = []) {
  const { variationsFromTheme } = (0, import_data.useSelect)((select) => {
    const _variationsFromTheme = select(
      import_core_data.store
    ).__experimentalGetCurrentThemeGlobalStylesVariations?.();
    return {
      variationsFromTheme: _variationsFromTheme || EMPTY_ARRAY
    };
  }, []);
  const { user: userVariation } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  return (0, import_element.useMemo)(() => {
    const clonedUserVariation = structuredClone(userVariation);
    const userVariationWithoutProperties = (0, import_utils.removePropertiesFromObject)(
      clonedUserVariation,
      properties
    );
    userVariationWithoutProperties.title = (0, import_i18n.__)("Default");
    const variationsWithPropertiesAndBase = variationsFromTheme.filter((variation) => {
      return (0, import_utils.isVariationWithProperties)(variation, properties);
    }).map((variation) => {
      return (0, import_global_styles_engine.mergeGlobalStyles)(
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
  const randomizeColors = (0, import_element.useCallback)(() => {
    if (!themeColors || !themeColors.length) {
      return;
    }
    const randomRotationValue = Math.floor(Math.random() * 225);
    const newColors = themeColors.map((colorObject) => {
      const { color } = colorObject;
      const newColor = (0, import_colord.colord)(color).rotate(randomRotationValue).toHex();
      return {
        ...colorObject,
        color: newColor
      };
    });
    setThemeColors(newColors);
  }, [themeColors, setThemeColors]);
  return window.__experimentalEnableColorRandomizer ? [randomizeColors] : [];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useColorRandomizer,
  useColorVariations,
  useCurrentMergeThemeStyleVariationsWithUserConfig,
  useSetting,
  useStyle
});
//# sourceMappingURL=hooks.cjs.map
