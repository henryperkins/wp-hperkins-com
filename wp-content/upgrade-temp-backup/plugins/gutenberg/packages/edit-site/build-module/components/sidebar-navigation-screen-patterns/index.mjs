// packages/edit-site/src/components/sidebar-navigation-screen-patterns/index.js
import {
  __experimentalItemGroup as ItemGroup,
  __experimentalItem as Item
} from "@wordpress/components";
import { getTemplatePartIcon } from "@wordpress/editor";
import { __ } from "@wordpress/i18n";
import { file } from "@wordpress/icons";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import CategoryItem from "./category-item.mjs";
import {
  PATTERN_DEFAULT_CATEGORY,
  PATTERN_TYPES,
  TEMPLATE_PART_POST_TYPE,
  TEMPLATE_PART_ALL_AREAS_CATEGORY
} from "../../utils/constants.mjs";
import usePatternCategories from "./use-pattern-categories.mjs";
import useTemplatePartAreas from "./use-template-part-areas.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
function CategoriesGroup({
  templatePartAreas,
  patternCategories,
  currentCategory,
  currentType
}) {
  const [allPatterns, ...otherPatterns] = patternCategories;
  return /* @__PURE__ */ jsxs(ItemGroup, { className: "edit-site-sidebar-navigation-screen-patterns__group", children: [
    /* @__PURE__ */ jsx(
      CategoryItem,
      {
        count: Object.values(templatePartAreas).map(({ templateParts }) => templateParts?.length || 0).reduce((acc, val) => acc + val, 0),
        icon: getTemplatePartIcon(),
        label: __("All template parts"),
        id: TEMPLATE_PART_ALL_AREAS_CATEGORY,
        type: TEMPLATE_PART_POST_TYPE,
        isActive: currentCategory === TEMPLATE_PART_ALL_AREAS_CATEGORY && currentType === TEMPLATE_PART_POST_TYPE
      },
      "all"
    ),
    Object.entries(templatePartAreas).map(
      ([area, { label, templateParts, icon }]) => /* @__PURE__ */ jsx(
        CategoryItem,
        {
          count: templateParts?.length,
          icon: getTemplatePartIcon(icon),
          label,
          id: area,
          type: TEMPLATE_PART_POST_TYPE,
          isActive: currentCategory === area && currentType === TEMPLATE_PART_POST_TYPE
        },
        area
      )
    ),
    /* @__PURE__ */ jsx("div", { className: "edit-site-sidebar-navigation-screen-patterns__divider" }),
    allPatterns && /* @__PURE__ */ jsx(
      CategoryItem,
      {
        count: allPatterns.count,
        label: allPatterns.label,
        icon: file,
        id: allPatterns.name,
        type: PATTERN_TYPES.user,
        isActive: currentCategory === `${allPatterns.name}` && currentType === PATTERN_TYPES.user
      },
      allPatterns.name
    ),
    otherPatterns.map((category) => /* @__PURE__ */ jsx(
      CategoryItem,
      {
        count: category.count,
        label: category.label,
        icon: file,
        id: category.name,
        type: PATTERN_TYPES.user,
        isActive: currentCategory === `${category.name}` && currentType === PATTERN_TYPES.user
      },
      category.name
    ))
  ] });
}
function SidebarNavigationScreenPatterns({ backPath }) {
  const {
    query: { postType = "wp_block", categoryId }
  } = useLocation();
  const currentCategory = categoryId || (postType === PATTERN_TYPES.user ? PATTERN_DEFAULT_CATEGORY : TEMPLATE_PART_ALL_AREAS_CATEGORY);
  const { templatePartAreas, hasTemplateParts, isLoading } = useTemplatePartAreas();
  const { patternCategories, hasPatterns } = usePatternCategories();
  return /* @__PURE__ */ jsx(
    SidebarNavigationScreen,
    {
      title: __("Patterns"),
      description: __(
        "Manage what patterns are available when editing the site."
      ),
      isRoot: !backPath,
      backPath,
      content: /* @__PURE__ */ jsxs(Fragment, { children: [
        isLoading && __("Loading items\u2026"),
        !isLoading && /* @__PURE__ */ jsxs(Fragment, { children: [
          !hasTemplateParts && !hasPatterns && /* @__PURE__ */ jsx(ItemGroup, { className: "edit-site-sidebar-navigation-screen-patterns__group", children: /* @__PURE__ */ jsx(Item, { children: __("No items found") }) }),
          /* @__PURE__ */ jsx(
            CategoriesGroup,
            {
              templatePartAreas,
              patternCategories,
              currentCategory,
              currentType: postType
            }
          )
        ] })
      ] })
    }
  );
}
export {
  SidebarNavigationScreenPatterns as default
};
//# sourceMappingURL=index.mjs.map
