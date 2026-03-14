// packages/editor/src/components/style-book/categories.ts
import { getCategories } from "@wordpress/blocks";
import {
  STYLE_BOOK_CATEGORIES,
  STYLE_BOOK_THEME_SUBCATEGORIES
} from "./constants.mjs";
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
    ...STYLE_BOOK_THEME_SUBCATEGORIES,
    ...STYLE_BOOK_CATEGORIES
  ].map(({ slug }) => slug);
  const extraCategories = getCategories();
  const extraCategoriesFiltered = extraCategories.filter(
    ({ slug }) => !reservedCategories.includes(slug)
  );
  return [...STYLE_BOOK_CATEGORIES, ...extraCategoriesFiltered];
}
export {
  getExamplesByCategory,
  getTopLevelStyleBookCategories
};
//# sourceMappingURL=categories.mjs.map
