// packages/edit-site/src/components/site-editor-routes/pages.js
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { __ } from "@wordpress/i18n";
import { loadView } from "@wordpress/views";
import Editor from "../editor/index.mjs";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import SidebarNavigationScreenUnsupported from "../sidebar-navigation-screen-unsupported/index.mjs";
import DataViewsSidebarContent from "../sidebar-dataviews/index.mjs";
import PostList from "../post-list/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import {
  DEFAULT_VIEW,
  getActiveViewOverridesForTab
} from "../post-list/view-utils.mjs";
import { jsx } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
async function isListView(query) {
  const { activeView = "all" } = query;
  const view = await loadView({
    kind: "postType",
    name: "page",
    slug: "default",
    defaultView: DEFAULT_VIEW,
    activeViewOverrides: getActiveViewOverridesForTab(activeView)
  });
  return view.type === "list";
}
function MobilePagesView() {
  const { query = {} } = useLocation();
  const { canvas = "view" } = query;
  return canvas === "edit" ? /* @__PURE__ */ jsx(Editor, {}) : /* @__PURE__ */ jsx(PostList, { postType: "page" });
}
var pagesRoute = {
  name: "pages",
  path: "/page",
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
    content({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(PostList, { postType: "page" }) : void 0;
    },
    async preview({ query, siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      if (!isBlockTheme) {
        return void 0;
      }
      const isList = await isListView(query);
      return isList ? /* @__PURE__ */ jsx(Editor, {}) : void 0;
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ jsx(MobilePagesView, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    }
  },
  widths: {
    async content({ query }) {
      const isList = await isListView(query);
      return isList ? 380 : void 0;
    }
  }
};
export {
  pagesRoute
};
//# sourceMappingURL=pages.mjs.map
