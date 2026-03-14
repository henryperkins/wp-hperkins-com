// packages/editor/src/components/visual-editor/edit-template-blocks-notification.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { __experimentalConfirmDialog as ConfirmDialog } from "@wordpress/components";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function EditTemplateBlocksNotification({ contentRef }) {
  const { onNavigateToEntityRecord, templateId } = useSelect((select) => {
    const { getEditorSettings, getCurrentTemplateId } = select(editorStore);
    return {
      onNavigateToEntityRecord: getEditorSettings().onNavigateToEntityRecord,
      templateId: getCurrentTemplateId()
    };
  }, []);
  const canEditTemplate = useSelect(
    (select) => !!select(coreStore).canUser("create", {
      kind: "postType",
      name: "wp_template"
    }),
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      isOpen: isDialogOpen,
      confirmButtonText: __("Edit template"),
      onConfirm: () => {
        setIsDialogOpen(false);
        onNavigateToEntityRecord({
          postId: templateId,
          postType: "wp_template"
        });
      },
      onCancel: () => setIsDialogOpen(false),
      size: "medium",
      children: __(
        "You\u2019ve tried to select a block that is part of a template that may be used elsewhere on your site. Would you like to edit the template?"
      )
    }
  );
}
export {
  EditTemplateBlocksNotification as default
};
//# sourceMappingURL=edit-template-blocks-notification.mjs.map
