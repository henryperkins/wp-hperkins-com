// packages/edit-site/src/components/site-editor-routes/page-item.js
import { __ } from "@wordpress/i18n";
import Editor from "../editor/index.mjs";
import DataViewsSidebarContent from "../sidebar-dataviews/index.mjs";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import SidebarNavigationScreenUnsupported from "../sidebar-navigation-screen-unsupported/index.mjs";
import { jsx } from "react/jsx-runtime";
var pageItemRoute = {
  name: "page-item",
  path: "/page/:postId",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(
        SidebarNavigationScreen,
        {
          title: __("Pages"),
          backPath: "/",
          content: /* @__PURE__ */ jsx(DataViewsSidebarContent, { postType: "page" })
        }
      ) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(Editor, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    },
    preview({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(Editor, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    }
  }
};
export {
  pageItemRoute
};
//# sourceMappingURL=page-item.mjs.map
