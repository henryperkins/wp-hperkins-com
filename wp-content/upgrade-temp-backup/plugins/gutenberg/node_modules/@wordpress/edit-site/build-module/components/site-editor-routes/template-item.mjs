// packages/edit-site/src/components/site-editor-routes/template-item.js
import Editor from "../editor/index.mjs";
import SidebarNavigationScreenTemplatesBrowse from "../sidebar-navigation-screen-templates-browse/index.mjs";
import SidebarNavigationScreenUnsupported from "../sidebar-navigation-screen-unsupported/index.mjs";
import { jsx } from "react/jsx-runtime";
var areas = {
  sidebar({ siteData }) {
    const isBlockTheme = siteData.currentTheme?.is_block_theme;
    return isBlockTheme ? /* @__PURE__ */ jsx(SidebarNavigationScreenTemplatesBrowse, { backPath: "/" }) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
  },
  mobile({ siteData }) {
    const isBlockTheme = siteData.currentTheme?.is_block_theme;
    return isBlockTheme ? /* @__PURE__ */ jsx(Editor, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
  },
  preview({ siteData }) {
    const isBlockTheme = siteData.currentTheme?.is_block_theme;
    return isBlockTheme ? /* @__PURE__ */ jsx(Editor, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
  }
};
var templateItemRoute = {
  name: "template-item",
  path: "/wp_template/*postId",
  areas
};
export {
  templateItemRoute
};
//# sourceMappingURL=template-item.mjs.map
