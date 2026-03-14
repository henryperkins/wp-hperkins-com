"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/components/sidebar-navigation-screen-patterns/index.js
var sidebar_navigation_screen_patterns_exports = {};
__export(sidebar_navigation_screen_patterns_exports, {
  default: () => SidebarNavigationScreenPatterns
});
module.exports = __toCommonJS(sidebar_navigation_screen_patterns_exports);
var import_components = require("@wordpress/components");
var import_editor = require("@wordpress/editor");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_router = require("@wordpress/router");
var import_sidebar_navigation_screen = __toESM(require("../sidebar-navigation-screen/index.cjs"));
var import_category_item = __toESM(require("./category-item.cjs"));
var import_constants = require("../../utils/constants.cjs");
var import_use_pattern_categories = __toESM(require("./use-pattern-categories.cjs"));
var import_use_template_part_areas = __toESM(require("./use-template-part-areas.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function CategoriesGroup({
  templatePartAreas,
  patternCategories,
  currentCategory,
  currentType
}) {
  const [allPatterns, ...otherPatterns] = patternCategories;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalItemGroup, { className: "edit-site-sidebar-navigation-screen-patterns__group", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_category_item.default,
      {
        count: Object.values(templatePartAreas).map(({ templateParts }) => templateParts?.length || 0).reduce((acc, val) => acc + val, 0),
        icon: (0, import_editor.getTemplatePartIcon)(),
        label: (0, import_i18n.__)("All template parts"),
        id: import_constants.TEMPLATE_PART_ALL_AREAS_CATEGORY,
        type: import_constants.TEMPLATE_PART_POST_TYPE,
        isActive: currentCategory === import_constants.TEMPLATE_PART_ALL_AREAS_CATEGORY && currentType === import_constants.TEMPLATE_PART_POST_TYPE
      },
      "all"
    ),
    Object.entries(templatePartAreas).map(
      ([area, { label, templateParts, icon }]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_category_item.default,
        {
          count: templateParts?.length,
          icon: (0, import_editor.getTemplatePartIcon)(icon),
          label,
          id: area,
          type: import_constants.TEMPLATE_PART_POST_TYPE,
          isActive: currentCategory === area && currentType === import_constants.TEMPLATE_PART_POST_TYPE
        },
        area
      )
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-sidebar-navigation-screen-patterns__divider" }),
    allPatterns && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_category_item.default,
      {
        count: allPatterns.count,
        label: allPatterns.label,
        icon: import_icons.file,
        id: allPatterns.name,
        type: import_constants.PATTERN_TYPES.user,
        isActive: currentCategory === `${allPatterns.name}` && currentType === import_constants.PATTERN_TYPES.user
      },
      allPatterns.name
    ),
    otherPatterns.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_category_item.default,
      {
        count: category.count,
        label: category.label,
        icon: import_icons.file,
        id: category.name,
        type: import_constants.PATTERN_TYPES.user,
        isActive: currentCategory === `${category.name}` && currentType === import_constants.PATTERN_TYPES.user
      },
      category.name
    ))
  ] });
}
function SidebarNavigationScreenPatterns({ backPath }) {
  const {
    query: { postType = "wp_block", categoryId }
  } = useLocation();
  const currentCategory = categoryId || (postType === import_constants.PATTERN_TYPES.user ? import_constants.PATTERN_DEFAULT_CATEGORY : import_constants.TEMPLATE_PART_ALL_AREAS_CATEGORY);
  const { templatePartAreas, hasTemplateParts, isLoading } = (0, import_use_template_part_areas.default)();
  const { patternCategories, hasPatterns } = (0, import_use_pattern_categories.default)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_screen.default,
    {
      title: (0, import_i18n.__)("Patterns"),
      description: (0, import_i18n.__)(
        "Manage what patterns are available when editing the site."
      ),
      isRoot: !backPath,
      backPath,
      content: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        isLoading && (0, import_i18n.__)("Loading items\u2026"),
        !isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          !hasTemplateParts && !hasPatterns && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { className: "edit-site-sidebar-navigation-screen-patterns__group", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItem, { children: (0, import_i18n.__)("No items found") }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
//# sourceMappingURL=index.cjs.map
