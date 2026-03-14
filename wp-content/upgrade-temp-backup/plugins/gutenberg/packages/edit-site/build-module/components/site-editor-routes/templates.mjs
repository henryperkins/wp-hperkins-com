// packages/edit-site/src/components/site-editor-routes/templates.js
import { loadView } from "@wordpress/views";
import Editor from "../editor/index.mjs";
import SidebarNavigationScreenTemplatesBrowse from "../sidebar-navigation-screen-templates-browse/index.mjs";
import SidebarNavigationScreenUnsupported from "../sidebar-navigation-screen-unsupported/index.mjs";
import PageTemplates from "../page-templates/index.mjs";
import PageTemplatesLegacy from "../page-templates/index-legacy.mjs";
import {
  DEFAULT_VIEW,
  getActiveViewOverridesForTab
} from "../page-templates/view-utils.mjs";
import { jsx } from "react/jsx-runtime";
async function isTemplateListView(query) {
  const { activeView = "active" } = query;
  const view = await loadView({
    kind: "postType",
    name: "wp_template",
    slug: "default",
    defaultView: DEFAULT_VIEW,
    activeViewOverrides: getActiveViewOverridesForTab(activeView)
  });
  return view.type === "list";
}
var templatesRoute = {
  name: "templates",
  path: "/template",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(SidebarNavigationScreenTemplatesBrowse, { backPath: "/" }) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    },
    content({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      if (!isBlockTheme) {
        return void 0;
      }
      return window?.__experimentalTemplateActivate ? /* @__PURE__ */ jsx(PageTemplates, {}) : /* @__PURE__ */ jsx(PageTemplatesLegacy, {});
    },
    async preview({ query, siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      if (!isBlockTheme) {
        return void 0;
      }
      const isListView = await isTemplateListView(query);
      return isListView ? /* @__PURE__ */ jsx(Editor, {}) : void 0;
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      if (!isBlockTheme) {
        return /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
      }
      const isTemplateActivateEnabled = typeof window !== "undefined" && window.__experimentalTemplateActivate;
      return isTemplateActivateEnabled ? /* @__PURE__ */ jsx(PageTemplates, {}) : /* @__PURE__ */ jsx(PageTemplatesLegacy, {});
    }
  },
  widths: {
    async content({ query }) {
      const isListView = await isTemplateListView(query);
      return isListView ? 380 : void 0;
    }
  }
};
export {
  templatesRoute
};
//# sourceMappingURL=templates.mjs.map
