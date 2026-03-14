// packages/edit-post/src/components/preferences-modal/index.js
import { __ } from "@wordpress/i18n";
import { privateApis as preferencesPrivateApis } from "@wordpress/preferences";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { unlock } from "../../lock-unlock.mjs";
import MetaBoxesSection from "./meta-boxes-section.mjs";
import { jsx } from "react/jsx-runtime";
var { PreferenceToggleControl } = unlock(preferencesPrivateApis);
var { PreferencesModal } = unlock(editorPrivateApis);
function EditPostPreferencesModal() {
  const extraSections = {
    general: /* @__PURE__ */ jsx(MetaBoxesSection, { title: __("Advanced") }),
    appearance: /* @__PURE__ */ jsx(
      PreferenceToggleControl,
      {
        scope: "core/edit-post",
        featureName: "themeStyles",
        help: __("Make the editor look like your theme."),
        label: __("Use theme styles")
      }
    )
  };
  return /* @__PURE__ */ jsx(PreferencesModal, { extraSections });
}
export {
  EditPostPreferencesModal as default
};
//# sourceMappingURL=index.mjs.map
