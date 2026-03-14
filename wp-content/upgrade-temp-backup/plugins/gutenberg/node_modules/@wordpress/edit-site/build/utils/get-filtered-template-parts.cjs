"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/utils/get-filtered-template-parts.js
var get_filtered_template_parts_exports = {};
__export(get_filtered_template_parts_exports, {
  default: () => getFilteredTemplatePartBlocks
});
module.exports = __toCommonJS(get_filtered_template_parts_exports);
var import_blocks = require("@wordpress/blocks");
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
    if ((0, import_blocks.isTemplatePart)(block)) {
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
//# sourceMappingURL=get-filtered-template-parts.cjs.map
