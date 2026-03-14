// packages/edit-site/src/components/site-editor-routes/navigation.js
import { privateApis as routerPrivateApis } from "@wordpress/router";
import Editor from "../editor/index.mjs";
import SidebarNavigationScreenNavigationMenus from "../sidebar-navigation-screen-navigation-menus/index.mjs";
import SidebarNavigationScreenUnsupported from "../sidebar-navigation-screen-unsupported/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
function MobileNavigationView() {
  const { query = {} } = useLocation();
  const { canvas = "view" } = query;
  return canvas === "edit" ? /* @__PURE__ */ jsx(Editor, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenNavigationMenus, { backPath: "/" });
}
var navigationRoute = {
  name: "navigation",
  path: "/navigation",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(SidebarNavigationScreenNavigationMenus, { backPath: "/" }) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    },
    preview({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(Editor, {}) : void 0;
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(MobileNavigationView, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    }
  }
};
export {
  navigationRoute
};
//# sourceMappingURL=navigation.mjs.map
