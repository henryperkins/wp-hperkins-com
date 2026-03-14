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

// packages/global-styles-ui/src/font-sizes/confirm-reset-font-sizes-dialog.tsx
var confirm_reset_font_sizes_dialog_exports = {};
__export(confirm_reset_font_sizes_dialog_exports, {
  default: () => confirm_reset_font_sizes_dialog_default
});
module.exports = __toCommonJS(confirm_reset_font_sizes_dialog_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalConfirmDialog,
    {
      isOpen,
      cancelButtonText: (0, import_i18n.__)("Cancel"),
      confirmButtonText,
      onCancel: handleCancel,
      onConfirm: handleConfirm,
      size: "medium",
      children: text
    }
  );
}
var confirm_reset_font_sizes_dialog_default = ConfirmResetFontSizesDialog;
//# sourceMappingURL=confirm-reset-font-sizes-dialog.cjs.map
