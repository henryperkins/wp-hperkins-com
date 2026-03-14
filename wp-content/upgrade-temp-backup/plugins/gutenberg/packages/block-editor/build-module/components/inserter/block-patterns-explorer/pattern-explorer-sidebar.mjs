// packages/block-editor/src/components/inserter/block-patterns-explorer/pattern-explorer-sidebar.js
import { Button, SearchControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx, jsxs } from "react/jsx-runtime";
function PatternCategoriesList({
  selectedCategory,
  patternCategories,
  onClickCategory
}) {
  const baseClassName = "block-editor-block-patterns-explorer__sidebar";
  return /* @__PURE__ */ jsx("div", { className: `${baseClassName}__categories-list`, children: patternCategories.map(({ name, label }) => {
    return /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        label,
        className: `${baseClassName}__categories-list__item`,
        isPressed: selectedCategory === name,
        onClick: () => {
          onClickCategory(name);
        },
        children: label
      },
      name
    );
  }) });
}
function PatternsExplorerSearch({ searchValue, setSearchValue }) {
  const baseClassName = "block-editor-block-patterns-explorer__search";
  return /* @__PURE__ */ jsx("div", { className: baseClassName, children: /* @__PURE__ */ jsx(
    SearchControl,
    {
      onChange: setSearchValue,
      value: searchValue,
      label: __("Search"),
      placeholder: __("Search")
    }
  ) });
}
function PatternExplorerSidebar({
  selectedCategory,
  patternCategories,
  onClickCategory,
  searchValue,
  setSearchValue
}) {
  const baseClassName = "block-editor-block-patterns-explorer__sidebar";
  return /* @__PURE__ */ jsxs("div", { className: baseClassName, children: [
    /* @__PURE__ */ jsx(
      PatternsExplorerSearch,
      {
        searchValue,
        setSearchValue
      }
    ),
    !searchValue && /* @__PURE__ */ jsx(
      PatternCategoriesList,
      {
        selectedCategory,
        patternCategories,
        onClickCategory
      }
    )
  ] });
}
var pattern_explorer_sidebar_default = PatternExplorerSidebar;
export {
  pattern_explorer_sidebar_default as default
};
//# sourceMappingURL=pattern-explorer-sidebar.mjs.map
