// packages/edit-site/src/components/site-editor-routes/pattern-item.js
import Editor from "../editor/index.mjs";
import SidebarNavigationScreenPatterns from "../sidebar-navigation-screen-patterns/index.mjs";
import { isClassicThemeWithStyleBookSupport } from "./utils.mjs";
import { jsx } from "react/jsx-runtime";
var patternItemRoute = {
  name: "pattern-item",
  path: "/wp_block/:postId",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      const backPath = isBlockTheme || isClassicThemeWithStyleBookSupport(siteData) ? "/" : void 0;
      return /* @__PURE__ */ jsx(SidebarNavigationScreenPatterns, { backPath });
    },
    mobile: /* @__PURE__ */ jsx(Editor, {}),
    preview: /* @__PURE__ */ jsx(Editor, {})
  }
};
export {
  patternItemRoute
};
//# sourceMappingURL=pattern-item.mjs.map
