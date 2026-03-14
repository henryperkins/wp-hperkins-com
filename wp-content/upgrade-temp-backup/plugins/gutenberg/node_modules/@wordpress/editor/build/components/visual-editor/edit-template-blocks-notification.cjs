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

// packages/editor/src/components/visual-editor/edit-template-blocks-notification.js
var edit_template_blocks_notification_exports = {};
__export(edit_template_blocks_notification_exports, {
  default: () => EditTemplateBlocksNotification
});
module.exports = __toCommonJS(edit_template_blocks_notification_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function EditTemplateBlocksNotification({ contentRef }) {
  const { onNavigateToEntityRecord, templateId } = (0, import_data.useSelect)((select) => {
    const { getEditorSettings, getCurrentTemplateId } = select(import_store.store);
    return {
      onNavigateToEntityRecord: getEditorSettings().onNavigateToEntityRecord,
      templateId: getCurrentTemplateId()
    };
  }, []);
  const canEditTemplate = (0, import_data.useSelect)(
    (select) => !!select(import_core_data.store).canUser("create", {
      kind: "postType",
      name: "wp_template"
    }),
    []
  );
  const [isDialogOpen, setIsDialogOpen] = (0, import_element.useState)(false);
  (0, import_element.useEffect)(() => {
    const handleDblClick = (event) => {
      if (!canEditTemplate) {
        return;
      }
      if (!event.target.classList.contains("is-root-container") || event.target.dataset?.type === "core/template-part") {
        return;
      }
      if (!event.defaultPrevented) {
        event.preventDefault();
        setIsDialogOpen(true);
      }
    };
    const canvas = contentRef.current;
    canvas?.addEventListener("dblclick", handleDblClick);
    return () => {
      canvas?.removeEventListener("dblclick", handleDblClick);
    };
  }, [contentRef, canEditTemplate]);
  if (!canEditTemplate) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalConfirmDialog,
    {
      isOpen: isDialogOpen,
      confirmButtonText: (0, import_i18n.__)("Edit template"),
      onConfirm: () => {
        setIsDialogOpen(false);
        onNavigateToEntityRecord({
          postId: templateId,
          postType: "wp_template"
        });
      },
      onCancel: () => setIsDialogOpen(false),
      size: "medium",
      children: (0, import_i18n.__)(
        "You\u2019ve tried to select a block that is part of a template that may be used elsewhere on your site. Would you like to edit the template?"
      )
    }
  );
}
//# sourceMappingURL=edit-template-blocks-notification.cjs.map
