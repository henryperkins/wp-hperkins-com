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

// packages/global-styles-ui/src/font-sizes/confirm-delete-font-size-dialog.tsx
var confirm_delete_font_size_dialog_exports = {};
__export(confirm_delete_font_size_dialog_exports, {
  default: () => confirm_delete_font_size_dialog_default
});
module.exports = __toCommonJS(confirm_delete_font_size_dialog_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalConfirmDialog,
    {
      isOpen,
      cancelButtonText: (0, import_i18n.__)("Cancel"),
      confirmButtonText: (0, import_i18n.__)("Delete"),
      onCancel: handleCancel,
      onConfirm: handleConfirm,
      size: "medium",
      children: fontSize && (0, import_i18n.sprintf)(
        /* translators: %s: Name of the font size preset. */
        (0, import_i18n.__)(
          'Are you sure you want to delete "%s" font size preset?'
        ),
        fontSize.name
      )
    }
  );
}
var confirm_delete_font_size_dialog_default = ConfirmDeleteFontSizeDialog;
//# sourceMappingURL=confirm-delete-font-size-dialog.cjs.map
