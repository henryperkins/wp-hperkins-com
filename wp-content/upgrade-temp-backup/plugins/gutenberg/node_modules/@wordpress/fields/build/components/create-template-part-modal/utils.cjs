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

// packages/fields/src/components/create-template-part-modal/utils.js
var utils_exports = {};
__export(utils_exports, {
  getCleanTemplatePartSlug: () => getCleanTemplatePartSlug,
  getUniqueTemplatePartTitle: () => getUniqueTemplatePartTitle,
  useExistingTemplateParts: () => useExistingTemplateParts
});
module.exports = __toCommonJS(utils_exports);
var import_change_case = require("change-case");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var useExistingTemplateParts = () => {
  return (0, import_data.useSelect)(
    (select) => select(import_core_data.store).getEntityRecords(
      "postType",
      "wp_template_part",
      {
        per_page: -1
      }
    ),
    []
  ) ?? [];
};
var getUniqueTemplatePartTitle = (title, templateParts) => {
  const lowercaseTitle = title.toLowerCase();
  const existingTitles = templateParts.map(
    (templatePart) => templatePart.title.rendered.toLowerCase()
  );
  if (!existingTitles.includes(lowercaseTitle)) {
    return title;
  }
  let suffix = 2;
  while (existingTitles.includes(`${lowercaseTitle} ${suffix}`)) {
    suffix++;
  }
  return `${title} ${suffix}`;
};
var getCleanTemplatePartSlug = (title) => {
  return (0, import_change_case.paramCase)(title).replace(/[^\w-]+/g, "") || "wp-custom-part";
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCleanTemplatePartSlug,
  getUniqueTemplatePartTitle,
  useExistingTemplateParts
});
//# sourceMappingURL=utils.cjs.map
