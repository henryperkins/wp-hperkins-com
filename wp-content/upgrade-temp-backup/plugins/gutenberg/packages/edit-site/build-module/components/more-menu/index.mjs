// packages/edit-site/src/components/more-menu/index.js
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import SiteExport from "./site-export.mjs";
import WelcomeGuideMenuItem from "./welcome-guide-menu-item.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { ToolsMoreMenuGroup, PreferencesModal } = unlock(editorPrivateApis);
function MoreMenu() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(ToolsMoreMenuGroup, { children: [
      /* @__PURE__ */ jsx(SiteExport, {}),
      /* @__PURE__ */ jsx(WelcomeGuideMenuItem, {})
    ] }),
    /* @__PURE__ */ jsx(PreferencesModal, {})
  ] });
}
export {
  MoreMenu as default
};
//# sourceMappingURL=index.mjs.map
