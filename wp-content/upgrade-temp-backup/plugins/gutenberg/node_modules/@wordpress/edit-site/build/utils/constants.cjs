"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/edit-site/src/utils/constants.js
var constants_exports = {};
__export(constants_exports, {
  ATTACHMENT_POST_TYPE: () => ATTACHMENT_POST_TYPE,
  EXCLUDED_PATTERN_SOURCES: () => EXCLUDED_PATTERN_SOURCES,
  FOCUSABLE_ENTITIES: () => FOCUSABLE_ENTITIES,
  LAYOUT_GRID: () => LAYOUT_GRID,
  LAYOUT_LIST: () => LAYOUT_LIST,
  LAYOUT_TABLE: () => LAYOUT_TABLE,
  NAVIGATION_POST_TYPE: () => NAVIGATION_POST_TYPE,
  OPERATOR_AFTER: () => OPERATOR_AFTER,
  OPERATOR_BEFORE: () => OPERATOR_BEFORE,
  OPERATOR_IS: () => OPERATOR_IS,
  OPERATOR_IS_ANY: () => OPERATOR_IS_ANY,
  OPERATOR_IS_NONE: () => OPERATOR_IS_NONE,
  OPERATOR_IS_NOT: () => OPERATOR_IS_NOT,
  PATTERN_DEFAULT_CATEGORY: () => PATTERN_DEFAULT_CATEGORY,
  PATTERN_SYNC_TYPES: () => PATTERN_SYNC_TYPES,
  PATTERN_TYPES: () => PATTERN_TYPES,
  PATTERN_USER_CATEGORY: () => PATTERN_USER_CATEGORY,
  POST_TYPE_LABELS: () => POST_TYPE_LABELS,
  TEMPLATE_ORIGINS: () => TEMPLATE_ORIGINS,
  TEMPLATE_PART_ALL_AREAS_CATEGORY: () => TEMPLATE_PART_ALL_AREAS_CATEGORY,
  TEMPLATE_PART_AREA_DEFAULT_CATEGORY: () => TEMPLATE_PART_AREA_DEFAULT_CATEGORY,
  TEMPLATE_PART_POST_TYPE: () => TEMPLATE_PART_POST_TYPE,
  TEMPLATE_POST_TYPE: () => TEMPLATE_POST_TYPE
});
module.exports = __toCommonJS(constants_exports);
var import_i18n = require("@wordpress/i18n");
var import_patterns = require("@wordpress/patterns");
var import_lock_unlock = require("../lock-unlock.cjs");
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
} = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
var FOCUSABLE_ENTITIES = [
  TEMPLATE_PART_POST_TYPE,
  NAVIGATION_POST_TYPE,
  PATTERN_TYPES.user
];
var POST_TYPE_LABELS = {
  [TEMPLATE_POST_TYPE]: (0, import_i18n.__)("Template"),
  [TEMPLATE_PART_POST_TYPE]: (0, import_i18n.__)("Template part"),
  [PATTERN_TYPES.user]: (0, import_i18n.__)("Pattern"),
  [NAVIGATION_POST_TYPE]: (0, import_i18n.__)("Navigation")
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=constants.cjs.map
