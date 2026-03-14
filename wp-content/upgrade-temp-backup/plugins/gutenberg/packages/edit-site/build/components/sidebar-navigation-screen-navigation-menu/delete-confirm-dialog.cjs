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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/delete-confirm-dialog.js
var delete_confirm_dialog_exports = {};
__export(delete_confirm_dialog_exports, {
  default: () => DeleteConfirmDialog
});
module.exports = __toCommonJS(delete_confirm_dialog_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
function DeleteConfirmDialog({ onClose, onConfirm }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalConfirmDialog,
    {
      isOpen: true,
      onConfirm: () => {
        onConfirm();
        onClose();
      },
      onCancel: onClose,
      confirmButtonText: (0, import_i18n.__)("Delete"),
      size: "medium",
      children: (0, import_i18n.__)("Are you sure you want to delete this Navigation Menu?")
    }
  );
}
//# sourceMappingURL=delete-confirm-dialog.cjs.map
