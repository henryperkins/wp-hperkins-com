// packages/block-editor/src/components/inserter/block-patterns-tab/index.js
import { useState } from "@wordpress/element";
import { useViewportMatch } from "@wordpress/compose";
import { Button } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import PatternsExplorerModal from "../block-patterns-explorer/index.mjs";
import MobileTabNavigation from "../mobile-tab-navigation.mjs";
import { PatternCategoryPreviews } from "./pattern-category-previews.mjs";
import { usePatternCategories } from "./use-pattern-categories.mjs";
import CategoryTabs from "../category-tabs/index.mjs";
import InserterNoResults from "../no-results.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function BlockPatternsTab({
  onSelectCategory,
  selectedCategory,
  onInsert,
  rootClientId,
  children
}) {
  const [showPatternsExplorer, setShowPatternsExplorer] = useState(false);
  const categories = usePatternCategories(rootClientId);
  const isMobile = useViewportMatch("medium", "<");
  if (!categories.length) {
    return /* @__PURE__ */ jsx(InserterNoResults, {});
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !isMobile && /* @__PURE__ */ jsxs("div", { className: "block-editor-inserter__block-patterns-tabs-container", children: [
      /* @__PURE__ */ jsx(
        CategoryTabs,
        {
          categories,
          selectedCategory,
          onSelectCategory,
          children
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          className: "block-editor-inserter__patterns-explore-button",
          onClick: () => setShowPatternsExplorer(true),
          variant: "secondary",
          children: __("Explore all patterns")
        }
      )
    ] }),
    isMobile && /* @__PURE__ */ jsx(MobileTabNavigation, { categories, children: (category) => /* @__PURE__ */ jsx("div", { className: "block-editor-inserter__category-panel", children: /* @__PURE__ */ jsx(
      PatternCategoryPreviews,
      {
        onInsert,
        rootClientId,
        category
      },
      category.name
    ) }) }),
    showPatternsExplorer && /* @__PURE__ */ jsx(
      PatternsExplorerModal,
      {
        initialCategory: selectedCategory || categories[0],
        patternCategories: categories,
        onModalClose: () => setShowPatternsExplorer(false),
        rootClientId
      }
    )
  ] });
}
var block_patterns_tab_default = BlockPatternsTab;
export {
  block_patterns_tab_default as default
};
//# sourceMappingURL=index.mjs.map
