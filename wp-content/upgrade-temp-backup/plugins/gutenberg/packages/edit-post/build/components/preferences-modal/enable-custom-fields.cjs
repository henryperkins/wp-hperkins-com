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

// packages/edit-post/src/components/preferences-modal/enable-custom-fields.js
var enable_custom_fields_exports = {};
__export(enable_custom_fields_exports, {
  CustomFieldsConfirmation: () => CustomFieldsConfirmation,
  default: () => EnableCustomFieldsOption
});
module.exports = __toCommonJS(enable_custom_fields_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_editor = require("@wordpress/editor");
var import_preferences = require("@wordpress/preferences");
var import_url = require("@wordpress/url");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PreferenceBaseOption } = (0, import_lock_unlock.unlock)(import_preferences.privateApis);
function submitCustomFieldsForm() {
  const customFieldsForm = document.getElementById(
    "toggle-custom-fields-form"
  );
  customFieldsForm.querySelector('[name="_wp_http_referer"]').setAttribute("value", (0, import_url.getPathAndQueryString)(window.location.href));
  customFieldsForm.submit();
}
function CustomFieldsConfirmation({ willEnable }) {
  const [isReloading, setIsReloading] = (0, import_element.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "edit-post-preferences-modal__custom-fields-confirmation-message", children: (0, import_i18n.__)(
      "A page reload is required for this change. Make sure your content is saved before reloading."
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        variant: "secondary",
        isBusy: isReloading,
        accessibleWhenDisabled: true,
        disabled: isReloading,
        onClick: () => {
          setIsReloading(true);
          submitCustomFieldsForm();
        },
        children: willEnable ? (0, import_i18n.__)("Show & Reload Page") : (0, import_i18n.__)("Hide & Reload Page")
      }
    )
  ] });
}
function EnableCustomFieldsOption({ label }) {
  const areCustomFieldsEnabled = (0, import_data.useSelect)((select) => {
    return !!select(import_editor.store).getEditorSettings().enableCustomFields;
  }, []);
  const [isChecked, setIsChecked] = (0, import_element.useState)(areCustomFieldsEnabled);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    PreferenceBaseOption,
    {
      label,
      isChecked,
      onChange: setIsChecked,
      children: isChecked !== areCustomFieldsEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomFieldsConfirmation, { willEnable: isChecked })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CustomFieldsConfirmation
});
//# sourceMappingURL=enable-custom-fields.cjs.map
