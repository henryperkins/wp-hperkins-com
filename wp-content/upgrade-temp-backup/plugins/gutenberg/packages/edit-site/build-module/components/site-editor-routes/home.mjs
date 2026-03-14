// packages/edit-site/src/components/site-editor-routes/home.js
import SidebarNavigationScreenMain from "../sidebar-navigation-screen-main/index.mjs";
import SidebarNavigationScreenUnsupported from "../sidebar-navigation-screen-unsupported/index.mjs";
import Editor from "../editor/index.mjs";
import { isClassicThemeWithStyleBookSupport } from "./utils.mjs";
import { jsx } from "react/jsx-runtime";
var homeRoute = {
  name: "home",
  path: "/",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme || isClassicThemeWithStyleBookSupport(siteData) ? /* @__PURE__ */ jsx(SidebarNavigationScreenMain, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    },
    preview({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme || isClassicThemeWithStyleBookSupport(siteData) ? /* @__PURE__ */ jsx(Editor, { isHomeRoute: true }) : void 0;
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme || isClassicThemeWithStyleBookSupport(siteData) ? /* @__PURE__ */ jsx(SidebarNavigationScreenMain, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    }
  }
};
export {
  homeRoute
};
//# sourceMappingURL=home.mjs.map
