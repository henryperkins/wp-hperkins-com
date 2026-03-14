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

// packages/editor/src/components/post-template/reset-default-template.js
var reset_default_template_exports = {};
__export(reset_default_template_exports, {
  default: () => ResetDefaultTemplate
});
module.exports = __toCommonJS(reset_default_template_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function ResetDefaultTemplate({ onClick }) {
  const currentTemplateSlug = (0, import_hooks.useCurrentTemplateSlug)();
  const allowSwitchingTemplate = (0, import_hooks.useAllowSwitchingTemplates)();
  const { postType, postId } = (0, import_hooks.useEditedPostContext)();
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  if (!currentTemplateSlug || !allowSwitchingTemplate) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItem,
    {
      onClick: () => {
        editEntityRecord(
          "postType",
          postType,
          postId,
          { template: "" },
          { undoIgnore: true }
        );
        onClick();
      },
      children: (0, import_i18n.__)("Use default template")
    }
  );
}
//# sourceMappingURL=reset-default-template.cjs.map
