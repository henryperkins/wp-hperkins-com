// packages/block-library/src/navigation/constants.js
var DEFAULT_BLOCK = {
  name: "core/navigation-link",
  attributes: {
    kind: "post-type",
    type: "page"
  }
};
var PRIORITIZED_INSERTER_BLOCKS = [
  "core/navigation-link/page",
  "core/navigation-link"
];
var PRELOADED_NAVIGATION_MENUS_QUERY = {
  per_page: 100,
  status: ["publish", "draft"],
  order: "desc",
  orderby: "date"
};
var SELECT_NAVIGATION_MENUS_ARGS = [
  "postType",
  "wp_navigation",
  PRELOADED_NAVIGATION_MENUS_QUERY
];
var NAVIGATION_OVERLAY_TEMPLATE_PART_AREA = "navigation-overlay";
export {
  DEFAULT_BLOCK,
  NAVIGATION_OVERLAY_TEMPLATE_PART_AREA,
  PRELOADED_NAVIGATION_MENUS_QUERY,
  PRIORITIZED_INSERTER_BLOCKS,
  SELECT_NAVIGATION_MENUS_ARGS
};
//# sourceMappingURL=constants.mjs.map
