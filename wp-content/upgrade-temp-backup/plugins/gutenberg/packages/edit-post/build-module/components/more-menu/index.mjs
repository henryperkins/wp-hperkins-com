// packages/edit-post/src/components/more-menu/index.js
import { __ } from "@wordpress/i18n";
import { useViewportMatch } from "@wordpress/compose";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { displayShortcut } from "@wordpress/keycodes";
import { PreferenceToggleMenuItem } from "@wordpress/preferences";
import { unlock } from "../../lock-unlock.mjs";
import ManagePatternsMenuItem from "./manage-patterns-menu-item.mjs";
import WelcomeGuideMenuItem from "./welcome-guide-menu-item.mjs";
import EditPostPreferencesModal from "../preferences-modal/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { ToolsMoreMenuGroup, ViewMoreMenuGroup } = unlock(editorPrivateApis);
var MoreMenu = () => {
  const isLargeViewport = useViewportMatch("large");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isLargeViewport && /* @__PURE__ */ jsx(ViewMoreMenuGroup, { children: /* @__PURE__ */ jsx(
      PreferenceToggleMenuItem,
      {
        scope: "core/edit-post",
        name: "fullscreenMode",
        label: __("Fullscreen mode"),
        info: __("Show and hide the admin user interface"),
        messageActivated: __("Fullscreen mode activated."),
        messageDeactivated: __(
          "Fullscreen mode deactivated."
        ),
        shortcut: displayShortcut.secondary("f")
      }
    ) }),
    /* @__PURE__ */ jsxs(ToolsMoreMenuGroup, { children: [
      /* @__PURE__ */ jsx(ManagePatternsMenuItem, {}),
      /* @__PURE__ */ jsx(WelcomeGuideMenuItem, {})
    ] }),
    /* @__PURE__ */ jsx(EditPostPreferencesModal, {})
  ] });
};
var more_menu_default = MoreMenu;
export {
  more_menu_default as default
};
//# sourceMappingURL=index.mjs.map
