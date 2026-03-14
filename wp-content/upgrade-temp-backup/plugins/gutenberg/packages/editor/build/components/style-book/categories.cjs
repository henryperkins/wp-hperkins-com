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

// packages/editor/src/components/style-book/categories.ts
var categories_exports = {};
__export(categories_exports, {
  getExamplesByCategory: () => getExamplesByCategory,
  getTopLevelStyleBookCategories: () => getTopLevelStyleBookCategories
});
module.exports = __toCommonJS(categories_exports);
var import_blocks = require("@wordpress/blocks");
var import_constants = require("./constants.cjs");
function getExamplesByCategory(categoryDefinition, examples) {
  if (!categoryDefinition?.slug || !examples?.length) {
    return;
  }
  const categories = categoryDefinition?.subcategories ?? [];
  if (categories.length) {
    return categories.reduce(
      (acc, subcategoryDefinition) => {
        const subcategoryExamples = getExamplesByCategory(
          subcategoryDefinition,
          examples
        );
        if (subcategoryExamples) {
          if (!acc.subcategories) {
            acc.subcategories = [];
          }
          acc.subcategories = [
            ...acc.subcategories,
            subcategoryExamples
          ];
        }
        return acc;
      },
      {
        title: categoryDefinition.title,
        slug: categoryDefinition.slug
      }
    );
  }
  const blocksToInclude = categoryDefinition?.blocks || [];
  const blocksToExclude = categoryDefinition?.exclude || [];
  const categoryExamples = examples.filter((example) => {
    return !blocksToExclude.includes(example.name) && (example.category === categoryDefinition.slug || blocksToInclude.includes(example.name));
  });
  if (!categoryExamples.length) {
    return;
  }
  return {
    title: categoryDefinition.title,
    slug: categoryDefinition.slug,
    examples: categoryExamples
  };
}
function getTopLevelStyleBookCategories() {
  const reservedCategories = [
    ...import_constants.STYLE_BOOK_THEME_SUBCATEGORIES,
    ...import_constants.STYLE_BOOK_CATEGORIES
  ].map(({ slug }) => slug);
  const extraCategories = (0, import_blocks.getCategories)();
  const extraCategoriesFiltered = extraCategories.filter(
    ({ slug }) => !reservedCategories.includes(slug)
  );
  return [...import_constants.STYLE_BOOK_CATEGORIES, ...extraCategoriesFiltered];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getExamplesByCategory,
  getTopLevelStyleBookCategories
});
//# sourceMappingURL=categories.cjs.map
