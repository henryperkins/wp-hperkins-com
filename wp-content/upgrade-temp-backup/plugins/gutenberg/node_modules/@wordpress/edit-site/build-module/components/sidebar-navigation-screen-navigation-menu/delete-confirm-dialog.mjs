// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/delete-confirm-dialog.js
import { __experimentalConfirmDialog as ConfirmDialog } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function DeleteConfirmDialog({ onClose, onConfirm }) {
  return /* @__PURE__ */ jsx(
    ConfirmDialog,
    {
      isOpen: true,
      onConfirm: () => {
        onConfirm();
        onClose();
      },
      onCancel: onClose,
      confirmButtonText: __("Delete"),
      size: "medium",
      children: __("Are you sure you want to delete this Navigation Menu?")
    }
  );
}
export {
  DeleteConfirmDialog as default
};
//# sourceMappingURL=delete-confirm-dialog.mjs.map
