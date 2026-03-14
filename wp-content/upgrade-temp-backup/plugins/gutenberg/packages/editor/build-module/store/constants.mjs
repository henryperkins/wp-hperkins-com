// packages/editor/src/store/constants.ts
var EDIT_MERGE_PROPERTIES = /* @__PURE__ */ new Set(["meta"]);
var STORE_NAME = "core/editor";
var PERMALINK_POSTNAME_REGEX = /%(?:postname|pagename)%/;
var ONE_MINUTE_IN_MS = 60 * 1e3;
var AUTOSAVE_PROPERTIES = ["title", "excerpt", "content"];
var TEMPLATE_PART_AREA_DEFAULT_CATEGORY = "uncategorized";
var TEMPLATE_POST_TYPE = "wp_template";
var TEMPLATE_PART_POST_TYPE = "wp_template_part";
var PATTERN_POST_TYPE = "wp_block";
var NAVIGATION_POST_TYPE = "wp_navigation";
var ATTACHMENT_POST_TYPE = "attachment";
var TEMPLATE_ORIGINS = {
  custom: "custom",
  theme: "theme",
  plugin: "plugin"
};
var TEMPLATE_POST_TYPES = ["wp_template", "wp_template_part"];
var GLOBAL_POST_TYPES = [
  ...TEMPLATE_POST_TYPES,
  "wp_block",
  "wp_navigation"
];
var DESIGN_POST_TYPES = [
  TEMPLATE_POST_TYPE,
  TEMPLATE_PART_POST_TYPE,
  PATTERN_POST_TYPE,
  NAVIGATION_POST_TYPE
];
export {
  ATTACHMENT_POST_TYPE,
  AUTOSAVE_PROPERTIES,
  DESIGN_POST_TYPES,
  EDIT_MERGE_PROPERTIES,
  GLOBAL_POST_TYPES,
  NAVIGATION_POST_TYPE,
  ONE_MINUTE_IN_MS,
  PATTERN_POST_TYPE,
  PERMALINK_POSTNAME_REGEX,
  STORE_NAME,
  TEMPLATE_ORIGINS,
  TEMPLATE_PART_AREA_DEFAULT_CATEGORY,
  TEMPLATE_PART_POST_TYPE,
  TEMPLATE_POST_TYPE,
  TEMPLATE_POST_TYPES
};
//# sourceMappingURL=constants.mjs.map
