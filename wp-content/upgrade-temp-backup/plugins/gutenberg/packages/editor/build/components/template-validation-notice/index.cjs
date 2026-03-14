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

// packages/editor/src/components/template-validation-notice/index.js
var template_validation_notice_exports = {};
__export(template_validation_notice_exports, {
  default: () => TemplateValidationNotice
});
module.exports = __toCommonJS(template_validation_notice_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_block_editor = require("@wordpress/block-editor");
var import_jsx_runtime = require("react/jsx-runtime");
function TemplateValidationNotice() {
  const [showConfirmDialog, setShowConfirmDialog] = (0, import_element.useState)(false);
  const isValid = (0, import_data.useSelect)((select) => {
    return select(import_block_editor.store).isValidTemplate();
  }, []);
  const { setTemplateValidity, synchronizeTemplate } = (0, import_data.useDispatch)(import_block_editor.store);
  if (isValid) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Notice,
      {
        className: "editor-template-validation-notice",
        isDismissible: false,
        status: "warning",
        actions: [
          {
            label: (0, import_i18n.__)("Keep it as is"),
            onClick: () => setTemplateValidity(true)
          },
          {
            label: (0, import_i18n.__)("Reset the template"),
            onClick: () => setShowConfirmDialog(true)
          }
        ],
        children: (0, import_i18n.__)(
          "The content of your post doesn\u2019t match the template assigned to your post type."
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalConfirmDialog,
      {
        isOpen: showConfirmDialog,
        confirmButtonText: (0, import_i18n.__)("Reset"),
        onConfirm: () => {
          setShowConfirmDialog(false);
          synchronizeTemplate();
        },
        onCancel: () => setShowConfirmDialog(false),
        size: "medium",
        children: (0, import_i18n.__)(
          "Resetting the template may result in loss of content, do you want to continue?"
        )
      }
    )
  ] });
}
//# sourceMappingURL=index.cjs.map
