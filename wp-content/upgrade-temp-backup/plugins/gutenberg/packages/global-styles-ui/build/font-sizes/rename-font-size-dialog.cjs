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

// packages/global-styles-ui/src/font-sizes/rename-font-size-dialog.tsx
var rename_font_size_dialog_exports = {};
__export(rename_font_size_dialog_exports, {
  default: () => rename_font_size_dialog_default
});
module.exports = __toCommonJS(rename_font_size_dialog_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
function RenameFontSizeDialog({
  fontSize,
  toggleOpen,
  handleRename
}) {
  const [newName, setNewName] = (0, import_element.useState)(
    fontSize.name
  );
  const handleConfirm = () => {
    if (newName && newName.trim()) {
      handleRename(newName);
    }
    toggleOpen();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Modal,
    {
      onRequestClose: toggleOpen,
      focusOnMount: "firstContentElement",
      title: (0, import_i18n.__)("Rename"),
      size: "small",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "form",
        {
          onSubmit: (event) => {
            event.preventDefault();
            handleConfirm();
            toggleOpen();
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.__experimentalInputControl,
              {
                __next40pxDefaultSize: true,
                autoComplete: "off",
                value: newName,
                onChange: setNewName,
                label: (0, import_i18n.__)("Name"),
                placeholder: (0, import_i18n.__)("Font size preset name")
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "right", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "tertiary",
                  onClick: toggleOpen,
                  children: (0, import_i18n.__)("Cancel")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                import_components.Button,
                {
                  __next40pxDefaultSize: true,
                  variant: "primary",
                  type: "submit",
                  children: (0, import_i18n.__)("Save")
                }
              )
            ] })
          ] })
        }
      )
    }
  );
}
var rename_font_size_dialog_default = RenameFontSizeDialog;
//# sourceMappingURL=rename-font-size-dialog.cjs.map
