// packages/fields/src/fields/password/edit.tsx
import {
  CheckboxControl,
  __experimentalVStack as VStack,
  TextControl
} from "@wordpress/components";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { jsx, jsxs } from "react/jsx-runtime";
function PasswordEdit({
  data,
  onChange,
  field
}) {
  const [showPassword, setShowPassword] = useState(
    !!field.getValue({ item: data })
  );
  const handleTogglePassword = (value) => {
    setShowPassword(value);
    if (!value) {
      onChange({ password: "" });
    }
  };
  return /* @__PURE__ */ jsxs(
    VStack,
    {
      as: "fieldset",
      spacing: 4,
      className: "fields-controls__password",
      children: [
        /* @__PURE__ */ jsx(
          CheckboxControl,
          {
            label: __("Password protected"),
            help: __("Only visible to those who know the password"),
            checked: showPassword,
            onChange: handleTogglePassword
          }
        ),
        showPassword && /* @__PURE__ */ jsx("div", { className: "fields-controls__password-input", children: /* @__PURE__ */ jsx(
          TextControl,
          {
            label: __("Password"),
            onChange: (value) => onChange({
              password: value
            }),
            value: field.getValue({ item: data }) || "",
            placeholder: __("Use a secure password"),
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
export {
  edit_default as default
};
//# sourceMappingURL=edit.mjs.map
