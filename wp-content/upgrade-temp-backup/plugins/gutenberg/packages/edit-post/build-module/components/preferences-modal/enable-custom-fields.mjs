// packages/edit-post/src/components/preferences-modal/enable-custom-fields.js
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "@wordpress/editor";
import { privateApis as preferencesPrivateApis } from "@wordpress/preferences";
import { getPathAndQueryString } from "@wordpress/url";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { PreferenceBaseOption } = unlock(preferencesPrivateApis);
function submitCustomFieldsForm() {
  const customFieldsForm = document.getElementById(
    "toggle-custom-fields-form"
  );
  customFieldsForm.querySelector('[name="_wp_http_referer"]').setAttribute("value", getPathAndQueryString(window.location.href));
  customFieldsForm.submit();
}
function CustomFieldsConfirmation({ willEnable }) {
  const [isReloading, setIsReloading] = useState(false);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("p", { className: "edit-post-preferences-modal__custom-fields-confirmation-message", children: __(
      "A page reload is required for this change. Make sure your content is saved before reloading."
    ) }),
    /* @__PURE__ */ jsx(
      Button,
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
        children: willEnable ? __("Show & Reload Page") : __("Hide & Reload Page")
      }
    )
  ] });
}
function EnableCustomFieldsOption({ label }) {
  const areCustomFieldsEnabled = useSelect((select) => {
    return !!select(editorStore).getEditorSettings().enableCustomFields;
  }, []);
  const [isChecked, setIsChecked] = useState(areCustomFieldsEnabled);
  return /* @__PURE__ */ jsx(
    PreferenceBaseOption,
    {
      label,
      isChecked,
      onChange: setIsChecked,
      children: isChecked !== areCustomFieldsEnabled && /* @__PURE__ */ jsx(CustomFieldsConfirmation, { willEnable: isChecked })
    }
  );
}
export {
  CustomFieldsConfirmation,
  EnableCustomFieldsOption as default
};
//# sourceMappingURL=enable-custom-fields.mjs.map
