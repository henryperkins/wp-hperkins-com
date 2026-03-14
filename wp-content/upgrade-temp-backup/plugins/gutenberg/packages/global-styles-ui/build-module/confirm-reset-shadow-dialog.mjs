// packages/global-styles-ui/src/confirm-reset-shadow-dialog.tsx
import { __experimentalConfirmDialog as ConfirmDialog } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function ConfirmResetShadowDialog({
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
var confirm_reset_shadow_dialog_default = ConfirmResetShadowDialog;
export {
  confirm_reset_shadow_dialog_default as default
};
//# sourceMappingURL=confirm-reset-shadow-dialog.mjs.map
