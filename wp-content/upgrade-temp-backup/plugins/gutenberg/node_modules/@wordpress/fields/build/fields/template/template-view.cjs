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

// packages/fields/src/fields/template/template-view.tsx
var template_view_exports = {};
__export(template_view_exports, {
  TemplateView: () => TemplateView
});
module.exports = __toCommonJS(template_view_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_utils = require("../../actions/utils.cjs");
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var TemplateView = ({
  item,
  field
}) => {
  const postType = item.type;
  const slug = item.slug;
  const postId = item.id;
  const templateSlug = field.getValue({ item });
  const defaultTemplateLabel = (0, import_hooks.useDefaultTemplateLabel)(
    postType,
    postId,
    slug
  );
  const templateLabel = (0, import_data.useSelect)(
    (select) => {
      if (!templateSlug) {
        return;
      }
      const allTemplates = select(
        import_core_data.store
      ).getEntityRecords("postType", "wp_template", {
        per_page: -1,
        post_type: postType
      });
      const match = allTemplates?.find(
        (t) => t.slug === templateSlug
      );
      return match ? (0, import_utils.getItemTitle)(match) : void 0;
    },
    [postType, templateSlug]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: templateLabel ?? defaultTemplateLabel });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TemplateView
});
//# sourceMappingURL=template-view.cjs.map
