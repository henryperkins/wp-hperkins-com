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

// packages/editor/src/utils/get-template-info.js
var get_template_info_exports = {};
__export(get_template_info_exports, {
  getTemplateInfo: () => getTemplateInfo
});
module.exports = __toCommonJS(get_template_info_exports);
var import_icons = require("@wordpress/icons");
var import_get_template_part_icon = require("./get-template-part-icon.cjs");
var EMPTY_OBJECT = {};
var getTemplateInfo = (params) => {
  if (!params) {
    return EMPTY_OBJECT;
  }
  const { templateTypes, templateAreas, template } = params;
  const { description, slug, title, area } = template;
  const { title: defaultTitle, description: defaultDescription } = Object.values(templateTypes).find((type) => type.slug === slug) ?? EMPTY_OBJECT;
  const templateTitle = typeof title === "string" ? title : title?.rendered;
  const templateDescription = typeof description === "string" ? description : description?.raw;
  const templateAreasWithIcon = templateAreas?.map((item) => ({
    ...item,
    icon: (0, import_get_template_part_icon.getTemplatePartIcon)(item.icon)
  }));
  const templateIcon = templateAreasWithIcon?.find((item) => area === item.area)?.icon || import_icons.layout;
  return {
    title: templateTitle && templateTitle !== slug ? templateTitle : defaultTitle || slug,
    description: templateDescription || defaultDescription,
    icon: templateIcon
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getTemplateInfo
});
//# sourceMappingURL=get-template-info.cjs.map
