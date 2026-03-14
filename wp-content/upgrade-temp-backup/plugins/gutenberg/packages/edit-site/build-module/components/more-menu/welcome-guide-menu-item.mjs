// packages/edit-site/src/components/more-menu/welcome-guide-menu-item.js
import { __ } from "@wordpress/i18n";
import { useDispatch } from "@wordpress/data";
import { MenuItem } from "@wordpress/components";
import { store as preferencesStore } from "@wordpress/preferences";
import { jsx } from "react/jsx-runtime";
function WelcomeGuideMenuItem() {
  const { toggle } = useDispatch(preferencesStore);
  return /* @__PURE__ */ jsx(MenuItem, { onClick: () => toggle("core/edit-site", "welcomeGuide"), children: __("Welcome Guide") });
}
export {
  WelcomeGuideMenuItem as default
};
//# sourceMappingURL=welcome-guide-menu-item.mjs.map
