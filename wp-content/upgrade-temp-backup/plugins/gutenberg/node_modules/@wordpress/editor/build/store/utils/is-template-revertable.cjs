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

// packages/editor/src/store/utils/is-template-revertable.js
var is_template_revertable_exports = {};
__export(is_template_revertable_exports, {
  default: () => isTemplateRevertable
});
module.exports = __toCommonJS(is_template_revertable_exports);
var import_constants = require("../constants.cjs");
function isTemplateRevertable(templateOrTemplatePart) {
  if (!templateOrTemplatePart) {
    return false;
  }
  return templateOrTemplatePart.source === import_constants.TEMPLATE_ORIGINS.custom && (Boolean(templateOrTemplatePart?.plugin) || templateOrTemplatePart?.has_theme_file);
}
//# sourceMappingURL=is-template-revertable.cjs.map
