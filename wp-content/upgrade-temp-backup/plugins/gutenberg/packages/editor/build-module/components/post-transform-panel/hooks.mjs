// packages/editor/src/components/post-transform-panel/hooks.js
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { store as coreStore } from "@wordpress/core-data";
import { parse } from "@wordpress/blocks";
import { privateApis as patternsPrivateApis } from "@wordpress/patterns";
import { unlock } from "../../lock-unlock.mjs";
import { store as editorStore } from "../../store/index.mjs";
var { EXCLUDED_PATTERN_SOURCES, PATTERN_TYPES } = unlock(patternsPrivateApis);
function injectThemeAttributeInBlockTemplateContent(block, currentThemeStylesheet) {
  block.innerBlocks = block.innerBlocks.map((innerBlock) => {
    return injectThemeAttributeInBlockTemplateContent(
      innerBlock,
      currentThemeStylesheet
    );
  });
  if (block.name === "core/template-part" && block.attributes.theme === void 0) {
    block.attributes.theme = currentThemeStylesheet;
  }
  return block;
}
function filterPatterns(patterns, template) {
  const filterOutDuplicatesByName = (currentItem, index, items) => index === items.findIndex((item) => currentItem.name === item.name);
  const filterOutExcludedPatternSources = (pattern) => {
    if (template.area === "navigation-overlay" && pattern.blockTypes?.includes(
      "core/template-part/navigation-overlay"
    )) {
      return true;
    }
    return !EXCLUDED_PATTERN_SOURCES.includes(pattern.source);
  };
  const filterCompatiblePatterns = (pattern) => pattern.templateTypes?.includes(template.slug) || pattern.blockTypes?.includes("core/template-part/" + template.area);
  return patterns.filter((pattern, index, items) => {
    return filterOutDuplicatesByName(pattern, index, items) && filterOutExcludedPatternSources(pattern) && filterCompatiblePatterns(pattern);
  });
}
function preparePatterns(patterns, currentThemeStylesheet) {
  return patterns.map((pattern) => ({
    ...pattern,
    keywords: pattern.keywords || [],
    type: PATTERN_TYPES.theme,
    blocks: parse(pattern.content, {
      __unstableSkipMigrationLogs: true
    }).map(
      (block) => injectThemeAttributeInBlockTemplateContent(
        block,
        currentThemeStylesheet
      )
    )
  }));
}
function useAvailablePatterns({ area, name, slug }) {
  const { blockPatterns, restBlockPatterns, currentThemeStylesheet } = useSelect((select) => {
    const { getEditorSettings } = select(editorStore);
    const settings = getEditorSettings();
    return {
      blockPatterns: settings.__experimentalAdditionalBlockPatterns ?? settings.__experimentalBlockPatterns,
      restBlockPatterns: select(coreStore).getBlockPatterns(),
      currentThemeStylesheet: select(coreStore).getCurrentTheme().stylesheet
    };
  }, []);
  return useMemo(() => {
    const mergedPatterns = [
      ...blockPatterns || [],
      ...restBlockPatterns || []
    ];
    const filteredPatterns = filterPatterns(mergedPatterns, {
      area,
      name,
      slug
    });
    return preparePatterns(filteredPatterns, currentThemeStylesheet);
  }, [
    area,
    name,
    slug,
    blockPatterns,
    restBlockPatterns,
    currentThemeStylesheet
  ]);
}
export {
  useAvailablePatterns
};
//# sourceMappingURL=hooks.mjs.map
