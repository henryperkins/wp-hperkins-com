// packages/edit-site/src/components/site-editor-routes/patterns.js
import SidebarNavigationScreenPatterns from "../sidebar-navigation-screen-patterns/index.mjs";
import PagePatterns from "../page-patterns/index.mjs";
import { isClassicThemeWithStyleBookSupport } from "./utils.mjs";
import { jsx } from "react/jsx-runtime";
var patternsRoute = {
  name: "patterns",
  path: "/pattern",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      const backPath = isBlockTheme || isClassicThemeWithStyleBookSupport(siteData) ? "/" : void 0;
      return /* @__PURE__ */ jsx(SidebarNavigationScreenPatterns, { backPath });
    },
    content: /* @__PURE__ */ jsx(PagePatterns, {}),
    mobile({ siteData, query }) {
      const { categoryId } = query;
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      const backPath = isBlockTheme || isClassicThemeWithStyleBookSupport(siteData) ? "/" : void 0;
      return !!categoryId ? /* @__PURE__ */ jsx(PagePatterns, {}) : /* @__PURE__ */ jsx(SidebarNavigationScreenPatterns, { backPath });
    }
  }
};
export {
  patternsRoute
};
//# sourceMappingURL=patterns.mjs.map
