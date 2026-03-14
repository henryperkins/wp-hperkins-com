// packages/edit-site/src/components/site-editor-routes/navigation-item.js
import { privateApis as routerPrivateApis } from "@wordpress/router";
import Editor from "../editor/index.mjs";
import SidebarNavigationScreenNavigationMenu from "../sidebar-navigation-screen-navigation-menu/index.mjs";
import SidebarNavigationScreenUnsupported from "../sidebar-navigation-screen-unsupported/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
function MobileNavigationItemView() {
  const { query = {} } = useLocation();
  const { canvas = "view" } = query;
  return canvas === "edit" ? /* @__PURE__ */ jsx(Editor, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenNavigationMenu, { backPath: "/navigation" });
}
var navigationItemRoute = {
  name: "navigation-item",
  path: "/wp_navigation/:postId",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(SidebarNavigationScreenNavigationMenu, { backPath: "/navigation" }) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    },
    preview({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(Editor, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(MobileNavigationItemView, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    }
  }
};
export {
  navigationItemRoute
};
//# sourceMappingURL=navigation-item.mjs.map
