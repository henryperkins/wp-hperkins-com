// packages/edit-site/src/utils/get-filtered-template-parts.js
import { isTemplatePart } from "@wordpress/blocks";
var EMPTY_ARRAY = [];
function getFilteredTemplatePartBlocks(blocks = EMPTY_ARRAY, templateParts) {
  const templatePartsById = templateParts ? (
    // Key template parts by their ID.
    templateParts.reduce(
      (newTemplateParts, part) => ({
        ...newTemplateParts,
        [part.id]: part
      }),
      {}
    )
  ) : {};
  const result = [];
  const stack = [...blocks];
  while (stack.length) {
    const { innerBlocks, ...block } = stack.shift();
    stack.unshift(...innerBlocks);
    if (isTemplatePart(block)) {
      const {
        attributes: { theme, slug }
      } = block;
      const templatePartId = `${theme}//${slug}`;
      const templatePart = templatePartsById[templatePartId];
      if (templatePart) {
        result.push({
          templatePart,
          block
        });
      }
    }
  }
  return result;
}
export {
  getFilteredTemplatePartBlocks as default
};
//# sourceMappingURL=get-filtered-template-parts.mjs.map
