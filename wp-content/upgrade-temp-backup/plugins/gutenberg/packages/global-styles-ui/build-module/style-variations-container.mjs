// packages/global-styles-ui/src/style-variations-container.tsx
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useContext, useMemo } from "@wordpress/element";
import { __experimentalGrid as Grid } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PreviewStyles from "./preview-styles.mjs";
import Variation from "./variations/variation.mjs";
import { GlobalStylesContext } from "./context.mjs";
import { isVariationWithProperties } from "./utils.mjs";
import { jsx } from "react/jsx-runtime";
function StyleVariationsContainer({
  gap = 2
}) {
  const { user } = useContext(GlobalStylesContext);
  const userStyles = user?.styles;
  const variations = useSelect((select) => {
    const result = select(
      coreStore
    ).__experimentalGetCurrentThemeGlobalStylesVariations();
    return Array.isArray(result) ? result : void 0;
  }, []);
  const fullStyleVariations = variations?.filter(
    (variation) => {
      return !isVariationWithProperties(variation, ["color"]) && !isVariationWithProperties(variation, [
        "typography",
        "spacing"
      ]);
    }
  );
  const themeVariations = useMemo(() => {
    const withEmptyVariation = [
      {
        title: __("Default"),
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
  return /* @__PURE__ */ jsx(
    Grid,
    {
      columns: 2,
      className: "global-styles-ui-style-variations-container",
      gap,
      children: themeVariations.map(
        (variation, index) => /* @__PURE__ */ jsx(Variation, { variation, children: (isFocused) => /* @__PURE__ */ jsx(
          PreviewStyles,
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
export {
  style_variations_container_default as default
};
//# sourceMappingURL=style-variations-container.mjs.map
