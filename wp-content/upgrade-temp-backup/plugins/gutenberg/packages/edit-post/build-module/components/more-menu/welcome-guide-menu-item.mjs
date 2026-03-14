// packages/edit-post/src/components/more-menu/welcome-guide-menu-item.js
import { useSelect } from "@wordpress/data";
import { PreferenceToggleMenuItem } from "@wordpress/preferences";
import { __ } from "@wordpress/i18n";
import { store as editorStore } from "@wordpress/editor";
import { jsx } from "react/jsx-runtime";
function WelcomeGuideMenuItem() {
  const isEditingTemplate = useSelect(
    (select) => select(editorStore).getCurrentPostType() === "wp_template",
    []
  );
  return /* @__PURE__ */ jsx(
    PreferenceToggleMenuItem,
    {
      scope: "core/edit-post",
      name: isEditingTemplate ? "welcomeGuideTemplate" : "welcomeGuide",
      label: __("Welcome Guide")
    }
  );
}
export {
  WelcomeGuideMenuItem as default
};
//# sourceMappingURL=welcome-guide-menu-item.mjs.map
