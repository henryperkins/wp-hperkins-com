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

// packages/fields/src/actions/utils.ts
var utils_exports = {};
__export(utils_exports, {
  getItemTitle: () => getItemTitle,
  isTemplate: () => isTemplate,
  isTemplateOrTemplatePart: () => isTemplateOrTemplatePart,
  isTemplatePart: () => isTemplatePart,
  isTemplateRemovable: () => isTemplateRemovable
});
module.exports = __toCommonJS(utils_exports);
var import_html_entities = require("@wordpress/html-entities");
var import_i18n = require("@wordpress/i18n");
function isTemplate(post) {
  return post.type === "wp_template";
}
function isTemplatePart(post) {
  return post.type === "wp_template_part";
}
function isTemplateOrTemplatePart(p) {
  return p.type === "wp_template" || p.type === "wp_template_part";
}
function getItemTitle(item, fallback = (0, import_i18n.__)("(no title)")) {
  let title = "";
  if (typeof item.title === "string") {
    title = (0, import_html_entities.decodeEntities)(item.title);
  } else if (item.title && "rendered" in item.title) {
    title = (0, import_html_entities.decodeEntities)(item.title.rendered);
  } else if (item.title && "raw" in item.title) {
    title = (0, import_html_entities.decodeEntities)(item.title.raw);
  }
  return title || fallback;
}
function isTemplateRemovable(template) {
  if (!template) {
    return false;
  }
  return [template.source, template.source].includes("custom") && !Boolean(template.type === "wp_template" && template?.plugin) && !template.has_theme_file;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getItemTitle,
  isTemplate,
  isTemplateOrTemplatePart,
  isTemplatePart,
  isTemplateRemovable
});
//# sourceMappingURL=utils.cjs.map
