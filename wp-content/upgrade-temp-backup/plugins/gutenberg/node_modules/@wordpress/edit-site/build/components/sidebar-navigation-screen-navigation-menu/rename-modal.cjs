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

// packages/edit-site/src/components/sidebar-navigation-screen-navigation-menu/rename-modal.js
var rename_modal_exports = {};
__export(rename_modal_exports, {
  default: () => RenameModal
});
module.exports = __toCommonJS(rename_modal_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
var notEmptyString = (testString) => testString?.trim()?.length > 0;
function RenameModal({ menuTitle, onClose, onSave }) {
  const [editedMenuTitle, setEditedMenuTitle] = (0, import_element.useState)(menuTitle);
  const titleHasChanged = editedMenuTitle !== menuTitle;
  const isEditedMenuTitleValid = titleHasChanged && notEmptyString(editedMenuTitle);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      title: (0, import_i18n.__)("Rename"),
      onRequestClose: onClose,
      focusOnMount: "firstContentElement",
      size: "small",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { className: "sidebar-navigation__rename-modal-form", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.TextControl,
          {
            __next40pxDefaultSize: true,
            value: editedMenuTitle,
            placeholder: (0, import_i18n.__)("Navigation title"),
            onChange: setEditedMenuTitle,
            label: (0, import_i18n.__)("Name")
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: onClose,
              children: (0, import_i18n.__)("Cancel")
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              accessibleWhenDisabled: true,
              disabled: !isEditedMenuTitleValid,
              variant: "primary",
              type: "submit",
              onClick: (e) => {
                e.preventDefault();
                if (!isEditedMenuTitleValid) {
                  return;
                }
                onSave({ title: editedMenuTitle });
                onClose();
              },
              children: (0, import_i18n.__)("Save")
            }
          )
        ] })
      ] }) })
    }
  );
}
//# sourceMappingURL=rename-modal.cjs.map
