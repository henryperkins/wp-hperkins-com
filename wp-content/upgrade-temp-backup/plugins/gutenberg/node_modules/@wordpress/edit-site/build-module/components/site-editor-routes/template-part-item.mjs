// packages/edit-site/src/components/site-editor-routes/template-part-item.js
import Editor from "../editor/index.mjs";
import SidebarNavigationScreenPatterns from "../sidebar-navigation-screen-patterns/index.mjs";
import { jsx } from "react/jsx-runtime";
var templatePartItemRoute = {
  name: "template-part-item",
  path: "/wp_template_part/*postId",
  areas: {
    sidebar: /* @__PURE__ */ jsx(SidebarNavigationScreenPatterns, { backPath: "/" }),
    mobile: /* @__PURE__ */ jsx(Editor, {}),
    preview: /* @__PURE__ */ jsx(Editor, {})
  }
};
export {
  templatePartItemRoute
};
//# sourceMappingURL=template-part-item.mjs.map
