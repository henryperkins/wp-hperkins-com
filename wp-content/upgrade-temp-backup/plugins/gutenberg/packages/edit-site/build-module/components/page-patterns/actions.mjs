// packages/edit-site/src/components/page-patterns/actions.js
import { DropdownMenu, MenuGroup } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { moreVertical } from "@wordpress/icons";
import AddNewPattern from "../add-new-pattern/index.mjs";
import RenameCategoryMenuItem from "./rename-category-menu-item.mjs";
import DeleteCategoryMenuItem from "./delete-category-menu-item.mjs";
import usePatternCategories from "../sidebar-navigation-screen-patterns/use-pattern-categories.mjs";
import { PATTERN_TYPES } from "../../utils/constants.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function PatternsActions({ categoryId, type }) {
  const { patternCategories } = usePatternCategories();
  let patternCategory;
  if (type === PATTERN_TYPES.user && !!categoryId) {
    patternCategory = patternCategories.find(
      (category) => category.name === categoryId
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(AddNewPattern, {}),
    !!patternCategory?.id && /* @__PURE__ */ jsx(
      DropdownMenu,
      {
        icon: moreVertical,
        label: __("Actions"),
        toggleProps: {
          className: "edit-site-patterns__button",
          size: "compact"
        },
        children: ({ onClose }) => /* @__PURE__ */ jsxs(MenuGroup, { children: [
          /* @__PURE__ */ jsx(
            RenameCategoryMenuItem,
            {
              category: patternCategory,
              onClose
            }
          ),
          /* @__PURE__ */ jsx(
            DeleteCategoryMenuItem,
            {
              category: patternCategory,
              onClose
            }
          )
        ] })
      }
    )
  ] });
}
export {
  PatternsActions as default
};
//# sourceMappingURL=actions.mjs.map
