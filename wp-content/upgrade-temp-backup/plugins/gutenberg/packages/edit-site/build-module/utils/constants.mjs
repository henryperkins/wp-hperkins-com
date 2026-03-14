// packages/edit-site/src/utils/constants.js
import { __ } from "@wordpress/i18n";
import { privateApis as patternPrivateApis } from "@wordpress/patterns";
import { unlock } from "../lock-unlock.mjs";
var ATTACHMENT_POST_TYPE = "attachment";
var NAVIGATION_POST_TYPE = "wp_navigation";
var TEMPLATE_POST_TYPE = "wp_template";
var TEMPLATE_PART_POST_TYPE = "wp_template_part";
var TEMPLATE_ORIGINS = {
  custom: "custom",
  theme: "theme",
  plugin: "plugin"
};
var TEMPLATE_PART_AREA_DEFAULT_CATEGORY = "uncategorized";
var TEMPLATE_PART_ALL_AREAS_CATEGORY = "all-parts";
var {
  PATTERN_TYPES,
  PATTERN_DEFAULT_CATEGORY,
  PATTERN_USER_CATEGORY,
  EXCLUDED_PATTERN_SOURCES,
  PATTERN_SYNC_TYPES
} = unlock(patternPrivateApis);
var FOCUSABLE_ENTITIES = [
  TEMPLATE_PART_POST_TYPE,
  NAVIGATION_POST_TYPE,
  PATTERN_TYPES.user
];
var POST_TYPE_LABELS = {
  [TEMPLATE_POST_TYPE]: __("Template"),
  [TEMPLATE_PART_POST_TYPE]: __("Template part"),
  [PATTERN_TYPES.user]: __("Pattern"),
  [NAVIGATION_POST_TYPE]: __("Navigation")
};
var LAYOUT_GRID = "grid";
var LAYOUT_TABLE = "table";
var LAYOUT_LIST = "list";
var OPERATOR_IS = "is";
var OPERATOR_IS_NOT = "isNot";
var OPERATOR_IS_ANY = "isAny";
var OPERATOR_IS_NONE = "isNone";
var OPERATOR_BEFORE = "before";
var OPERATOR_AFTER = "after";
export {
  ATTACHMENT_POST_TYPE,
  EXCLUDED_PATTERN_SOURCES,
  FOCUSABLE_ENTITIES,
  LAYOUT_GRID,
  LAYOUT_LIST,
  LAYOUT_TABLE,
  NAVIGATION_POST_TYPE,
  OPERATOR_AFTER,
  OPERATOR_BEFORE,
  OPERATOR_IS,
  OPERATOR_IS_ANY,
  OPERATOR_IS_NONE,
  OPERATOR_IS_NOT,
  PATTERN_DEFAULT_CATEGORY,
  PATTERN_SYNC_TYPES,
  PATTERN_TYPES,
  PATTERN_USER_CATEGORY,
  POST_TYPE_LABELS,
  TEMPLATE_ORIGINS,
  TEMPLATE_PART_ALL_AREAS_CATEGORY,
  TEMPLATE_PART_AREA_DEFAULT_CATEGORY,
  TEMPLATE_PART_POST_TYPE,
  TEMPLATE_POST_TYPE
};
//# sourceMappingURL=constants.mjs.map
