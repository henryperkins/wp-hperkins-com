// packages/global-styles-ui/src/font-sizes/confirm-reset-font-sizes-dialog.tsx
import { __experimentalConfirmDialog as ConfirmDialog } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function ConfirmResetFontSizesDialog({
  text,
  confirmButtonText,
  isOpen,
  toggleOpen,
  onConfirm
}) {
  const handleConfirm = async () => {
    toggleOpen();
    onConfirm();
  };
  const handleCancel = () => {
    toggleOpen();
  };
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      isOpen,
      cancelButtonText: __("Cancel"),
      confirmButtonText,
      onCancel: handleCancel,
      onConfirm: handleConfirm,
      size: "medium",
      children: text
    }
  );
}
var confirm_reset_font_sizes_dialog_default = ConfirmResetFontSizesDialog;
export {
  confirm_reset_font_sizes_dialog_default as default
};
//# sourceMappingURL=confirm-reset-font-sizes-dialog.mjs.map
