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

// packages/editor/src/components/post-template/create-new-template-modal.js
var create_new_template_modal_exports = {};
__export(create_new_template_modal_exports, {
  default: () => CreateNewTemplateModal
});
module.exports = __toCommonJS(create_new_template_modal_exports);
var import_change_case = require("change-case");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_blocks = require("@wordpress/blocks");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var DEFAULT_TITLE = (0, import_i18n.__)("Custom Template");
function CreateNewTemplateModal({ onClose }) {
  const { defaultBlockTemplate, onNavigateToEntityRecord } = (0, import_data.useSelect)(
    (select) => {
      const { getEditorSettings, getCurrentTemplateId } = select(import_store.store);
      return {
        defaultBlockTemplate: getEditorSettings().defaultBlockTemplate,
        onNavigateToEntityRecord: getEditorSettings().onNavigateToEntityRecord,
        getTemplateId: getCurrentTemplateId
      };
    }
  );
  const { createTemplate } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const [title, setTitle] = (0, import_element.useState)("");
  const [isBusy, setIsBusy] = (0, import_element.useState)(false);
  const cancel = () => {
    setTitle("");
    onClose();
  };
  const submit = async (event) => {
    event.preventDefault();
    if (isBusy) {
      return;
    }
    setIsBusy(true);
    const newTemplateContent = defaultBlockTemplate ?? (0, import_blocks.serialize)([
      (0, import_blocks.createBlock)(
        "core/group",
        {
          tagName: "header",
          layout: { inherit: true }
        },
        [
          (0, import_blocks.createBlock)("core/site-title"),
          (0, import_blocks.createBlock)("core/site-tagline")
        ]
      ),
      (0, import_blocks.createBlock)("core/separator"),
      (0, import_blocks.createBlock)(
        "core/group",
        {
          tagName: "main"
        },
        [
          (0, import_blocks.createBlock)(
            "core/group",
            {
              layout: { inherit: true }
            },
            [(0, import_blocks.createBlock)("core/post-title")]
          ),
          (0, import_blocks.createBlock)("core/post-content", {
            layout: { inherit: true }
          })
        ]
      )
    ]);
    const newTemplate = await createTemplate({
      slug: (0, import_change_case.paramCase)(title || DEFAULT_TITLE) || "wp-custom-template",
      content: newTemplateContent,
      title: title || DEFAULT_TITLE,
      status: "publish"
    });
    setIsBusy(false);
    onNavigateToEntityRecord({
      postId: newTemplate.id,
      postType: "wp_template"
    });
    cancel();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: (0, import_i18n.__)("Create custom template"),
      onRequestClose: cancel,
      focusOnMount: "firstContentElement",
      size: "small",
      overlayClassName: "editor-post-template__create-template-modal",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "form",
        {
          className: "editor-post-template__create-form",
          onSubmit: submit,
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.TextControl,
              {
                __next40pxDefaultSize: true,
                label: (0, import_i18n.__)("Name"),
                value: title,
                onChange: setTitle,
                placeholder: DEFAULT_TITLE,
                disabled: isBusy,
                help: (0, import_i18n.__)(
                  // eslint-disable-next-line no-restricted-syntax -- 'sidebar' is a common web design term for layouts
                  'Describe the template, e.g. "Post with sidebar". A custom template can be manually applied to any post or page.'
                )
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "tertiary",
                  onClick: cancel,
                  children: (0, import_i18n.__)("Cancel")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "primary",
                  type: "submit",
                  isBusy,
                  "aria-disabled": isBusy,
                  children: (0, import_i18n.__)("Create")
                }
              )
            ] })
          ] })
        }
      )
    }
  );
}
//# sourceMappingURL=create-new-template-modal.cjs.map
