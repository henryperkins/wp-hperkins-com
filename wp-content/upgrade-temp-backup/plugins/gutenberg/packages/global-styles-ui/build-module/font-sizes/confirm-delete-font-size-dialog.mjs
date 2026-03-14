// packages/global-styles-ui/src/font-sizes/confirm-delete-font-size-dialog.tsx
import { __experimentalConfirmDialog as ConfirmDialog } from "@wordpress/components";
import { __, sprintf } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function ConfirmDeleteFontSizeDialog({
  fontSize,
  isOpen,
  toggleOpen,
  handleRemoveFontSize
}) {
  const handleConfirm = async () => {
    toggleOpen();
    handleRemoveFontSize(fontSize);
  };
  const handleCancel = () => {
    toggleOpen();
  };
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      isOpen,
      cancelButtonText: __("Cancel"),
      confirmButtonText: __("Delete"),
      onCancel: handleCancel,
      onConfirm: handleConfirm,
      size: "medium",
      children: fontSize && sprintf(
        /* translators: %s: Name of the font size preset. */
        __(
          'Are you sure you want to delete "%s" font size preset?'
        ),
        fontSize.name
      )
    }
  );
}
var confirm_delete_font_size_dialog_default = ConfirmDeleteFontSizeDialog;
export {
  confirm_delete_font_size_dialog_default as default
};
//# sourceMappingURL=confirm-delete-font-size-dialog.mjs.map
