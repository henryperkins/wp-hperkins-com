// packages/edit-site/src/components/sidebar-navigation-screen-patterns/use-pattern-categories.js
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import useDefaultPatternCategories from "./use-default-pattern-categories.mjs";
import useThemePatterns from "./use-theme-patterns.mjs";
import usePatterns from "../page-patterns/use-patterns.mjs";
import {
  PATTERN_TYPES,
  PATTERN_DEFAULT_CATEGORY,
  PATTERN_USER_CATEGORY,
  TEMPLATE_PART_AREA_DEFAULT_CATEGORY
} from "../../utils/constants.mjs";
function usePatternCategories() {
  const defaultCategories = useDefaultPatternCategories();
  defaultCategories.push({
    name: TEMPLATE_PART_AREA_DEFAULT_CATEGORY,
    label: __("Uncategorized")
  });
  const themePatterns = useThemePatterns();
  const { patterns: userPatterns, categories: userPatternCategories } = usePatterns(PATTERN_TYPES.user);
  const patternCategories = useMemo(() => {
    const categoryMap = {};
    const categoriesWithCounts = [];
    defaultCategories.forEach((category) => {
      if (!categoryMap[category.name]) {
        categoryMap[category.name] = { ...category, count: 0 };
      }
    });
    userPatternCategories.forEach((category) => {
      if (!categoryMap[category.name]) {
        categoryMap[category.name] = { ...category, count: 0 };
      }
    });
    themePatterns.forEach((pattern) => {
      pattern.categories?.forEach((category) => {
        if (categoryMap[category]) {
          categoryMap[category].count += 1;
        }
      });
      if (!pattern.categories?.length) {
        categoryMap.uncategorized.count += 1;
      }
    });
    userPatterns.forEach((pattern) => {
      pattern.wp_pattern_category?.forEach((catId) => {
        const category = userPatternCategories.find(
          (cat) => cat.id === catId
        )?.name;
        if (categoryMap[category]) {
          categoryMap[category].count += 1;
        }
      });
      if (!pattern.wp_pattern_category?.length || !pattern.wp_pattern_category?.some(
        (catId) => userPatternCategories.find((cat) => cat.id === catId)
      )) {
        categoryMap.uncategorized.count += 1;
      }
    });
    [...defaultCategories, ...userPatternCategories].forEach(
      (category) => {
        if (categoryMap[category.name].count && !categoriesWithCounts.find(
          (cat) => cat.name === category.name
        )) {
          categoriesWithCounts.push(categoryMap[category.name]);
        }
      }
    );
    const sortedCategories = categoriesWithCounts.sort(
      (a, b) => a.label.localeCompare(b.label)
    );
    sortedCategories.unshift({
      name: PATTERN_USER_CATEGORY,
      label: __("My patterns"),
      count: userPatterns.length
    });
    sortedCategories.unshift({
      name: PATTERN_DEFAULT_CATEGORY,
      label: __("All patterns"),
      description: __("A list of all patterns from all sources."),
      count: themePatterns.length + userPatterns.length
    });
    return sortedCategories;
  }, [
    defaultCategories,
    themePatterns,
    userPatternCategories,
    userPatterns
  ]);
  return { patternCategories, hasPatterns: !!patternCategories.length };
}
export {
  usePatternCategories as default
};
//# sourceMappingURL=use-pattern-categories.mjs.map
