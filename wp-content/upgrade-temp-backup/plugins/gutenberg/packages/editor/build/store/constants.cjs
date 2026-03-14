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

// packages/editor/src/store/constants.ts
var constants_exports = {};
__export(constants_exports, {
  ATTACHMENT_POST_TYPE: () => ATTACHMENT_POST_TYPE,
  AUTOSAVE_PROPERTIES: () => AUTOSAVE_PROPERTIES,
  DESIGN_POST_TYPES: () => DESIGN_POST_TYPES,
  EDIT_MERGE_PROPERTIES: () => EDIT_MERGE_PROPERTIES,
  GLOBAL_POST_TYPES: () => GLOBAL_POST_TYPES,
  NAVIGATION_POST_TYPE: () => NAVIGATION_POST_TYPE,
  ONE_MINUTE_IN_MS: () => ONE_MINUTE_IN_MS,
  PATTERN_POST_TYPE: () => PATTERN_POST_TYPE,
  PERMALINK_POSTNAME_REGEX: () => PERMALINK_POSTNAME_REGEX,
  STORE_NAME: () => STORE_NAME,
  TEMPLATE_ORIGINS: () => TEMPLATE_ORIGINS,
  TEMPLATE_PART_AREA_DEFAULT_CATEGORY: () => TEMPLATE_PART_AREA_DEFAULT_CATEGORY,
  TEMPLATE_PART_POST_TYPE: () => TEMPLATE_PART_POST_TYPE,
  TEMPLATE_POST_TYPE: () => TEMPLATE_POST_TYPE,
  TEMPLATE_POST_TYPES: () => TEMPLATE_POST_TYPES
});
module.exports = __toCommonJS(constants_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=constants.cjs.map
