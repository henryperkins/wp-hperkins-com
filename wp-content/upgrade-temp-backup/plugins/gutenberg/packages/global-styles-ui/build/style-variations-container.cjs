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

// packages/global-styles-ui/src/style-variations-container.tsx
var style_variations_container_exports = {};
__export(style_variations_container_exports, {
  default: () => style_variations_container_default
});
module.exports = __toCommonJS(style_variations_container_exports);
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_preview_styles = __toESM(require("./preview-styles.cjs"));
var import_variation = __toESM(require("./variations/variation.cjs"));
var import_context = require("./context.cjs");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function StyleVariationsContainer({
  gap = 2
}) {
  const { user } = (0, import_element.useContext)(import_context.GlobalStylesContext);
  const userStyles = user?.styles;
  const variations = (0, import_data.useSelect)((select) => {
    const result = select(
      import_core_data.store
    ).__experimentalGetCurrentThemeGlobalStylesVariations();
    return Array.isArray(result) ? result : void 0;
  }, []);
  const fullStyleVariations = variations?.filter(
    (variation) => {
      return !(0, import_utils.isVariationWithProperties)(variation, ["color"]) && !(0, import_utils.isVariationWithProperties)(variation, [
        "typography",
        "spacing"
      ]);
    }
  );
  const themeVariations = (0, import_element.useMemo)(() => {
    const withEmptyVariation = [
      {
        title: (0, import_i18n.__)("Default"),
        settings: {},
        styles: {}
      },
      ...fullStyleVariations ?? []
    ];
    return [
      ...withEmptyVariation.map((variation) => {
        const blockStyles = variation?.styles?.blocks ? { ...variation.styles.blocks } : {};
        if (userStyles?.blocks) {
          Object.keys(userStyles.blocks).forEach((blockName) => {
            if (userStyles.blocks?.[blockName]?.css) {
              const variationBlockStyles = blockStyles[blockName] || {};
              const customCSS = {
                css: `${blockStyles[blockName]?.css || ""} ${userStyles.blocks?.[blockName]?.css?.trim() || ""}`
              };
              blockStyles[blockName] = {
                ...variationBlockStyles,
                ...customCSS
              };
            }
          });
        }
        const css = userStyles?.css || variation.styles?.css ? {
          css: `${variation.styles?.css || ""} ${userStyles?.css || ""}`
        } : {};
        const blocks = Object.keys(blockStyles).length > 0 ? { blocks: blockStyles } : {};
        const styles = {
          ...variation.styles,
          ...css,
          ...blocks
        };
        return {
          ...variation,
          settings: variation.settings ?? {},
          styles
        };
      })
    ];
  }, [fullStyleVariations, userStyles?.blocks, userStyles?.css]);
  if (!fullStyleVariations || fullStyleVariations.length < 1) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalGrid,
    {
      columns: 2,
      className: "global-styles-ui-style-variations-container",
      gap,
      children: themeVariations.map(
        (variation, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_variation.default, { variation, children: (isFocused) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_preview_styles.default,
          {
            label: variation?.title,
            withHoverView: true,
            isFocused,
            variation
          }
        ) }, index)
      )
    }
  );
}
var style_variations_container_default = StyleVariationsContainer;
//# sourceMappingURL=style-variations-container.cjs.map
