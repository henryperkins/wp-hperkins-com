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

// packages/fields/src/fields/template/template-edit.tsx
var template_edit_exports = {};
__export(template_edit_exports, {
  TemplateEdit: () => TemplateEdit
});
module.exports = __toCommonJS(template_edit_exports);
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_utils = require("../../actions/utils.cjs");
var import_hooks = require("./hooks.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_ARRAY = [];
var TemplateEdit = ({
  data,
  field,
  onChange
}) => {
  const { id } = field;
  const postType = data.type;
  const postId = typeof data.id === "number" ? data.id : parseInt(data.id, 10);
  const slug = data.slug;
  const { templates, canSwitchTemplate } = (0, import_data.useSelect)(
    (select) => {
      const allTemplates = select(import_core_data.store).getEntityRecords(
        "postType",
        "wp_template",
        {
          per_page: -1,
          post_type: postType
        }
      ) ?? EMPTY_ARRAY;
      const { getHomePage, getPostsPageId } = (0, import_lock_unlock.unlock)(
        select(import_core_data.store)
      );
      const singlePostId = String(postId);
      const isPostsPage = singlePostId !== void 0 && getPostsPageId() === singlePostId;
      const isFrontPage = singlePostId !== void 0 && postType === "page" && getHomePage()?.postId === singlePostId;
      return {
        templates: allTemplates,
        canSwitchTemplate: !isPostsPage && !isFrontPage
      };
    },
    [postId, postType]
  );
  const defaultTemplateLabel = (0, import_hooks.useDefaultTemplateLabel)(
    postType,
    postId,
    slug
  );
  const value = field.getValue({ item: data });
  const onChangeControl = (0, import_element.useCallback)(
    (newValue) => onChange({
      [id]: newValue
    }),
    [id, onChange]
  );
  const options = (0, import_element.useMemo)(() => {
    const templateOptions = templates.map((template) => ({
      label: (0, import_utils.getItemTitle)(template),
      value: template.slug
    }));
    return [
      { label: defaultTemplateLabel, value: "" },
      ...templateOptions
    ];
  }, [templates, defaultTemplateLabel]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.SelectControl,
    {
      __next40pxDefaultSize: true,
      label: (0, import_i18n.__)("Template"),
      hideLabelFromVision: true,
      value,
      options,
      onChange: onChangeControl,
      disabled: !canSwitchTemplate
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TemplateEdit
});
//# sourceMappingURL=template-edit.cjs.map
