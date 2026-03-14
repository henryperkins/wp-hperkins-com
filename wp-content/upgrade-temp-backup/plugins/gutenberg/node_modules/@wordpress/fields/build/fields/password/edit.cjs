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

// packages/fields/src/fields/password/edit.tsx
var edit_exports = {};
__export(edit_exports, {
  default: () => edit_default
});
module.exports = __toCommonJS(edit_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
function PasswordEdit({
  data,
  onChange,
  field
}) {
  const [showPassword, setShowPassword] = (0, import_element.useState)(
    !!field.getValue({ item: data })
  );
  const handleTogglePassword = (value) => {
    setShowPassword(value);
    if (!value) {
      onChange({ password: "" });
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      as: "fieldset",
      spacing: 4,
      className: "fields-controls__password",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.CheckboxControl,
          {
            label: (0, import_i18n.__)("Password protected"),
            help: (0, import_i18n.__)("Only visible to those who know the password"),
            checked: showPassword,
            onChange: handleTogglePassword
          }
        ),
        showPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fields-controls__password-input", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.TextControl,
          {
            label: (0, import_i18n.__)("Password"),
            onChange: (value) => onChange({
              password: value
            }),
            value: field.getValue({ item: data }) || "",
            placeholder: (0, import_i18n.__)("Use a secure password"),
            type: "text",
            __next40pxDefaultSize: true,
            maxLength: 255
          }
        ) })
      ]
    }
  );
}
var edit_default = PasswordEdit;
//# sourceMappingURL=edit.cjs.map
