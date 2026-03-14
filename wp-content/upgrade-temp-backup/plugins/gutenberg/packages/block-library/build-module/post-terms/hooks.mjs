// packages/block-library/src/post-terms/hooks.js
import { postCategories, postTerms } from "@wordpress/icons";
var variationIconMap = {
  category: postCategories,
  post_tag: postTerms
};
function enhanceVariations(settings, name) {
  if (name !== "core/post-terms") {
    return settings;
  }
  const variations = settings.variations.map((variation) => ({
    ...variation,
    ...{
      icon: variationIconMap[variation.name] ?? postCategories
    }
  }));
  return {
    ...settings,
    variations
  };
}
export {
  enhanceVariations as default
};
//# sourceMappingURL=hooks.mjs.map
