// packages/edit-site/src/components/site-editor-routes/attachment-item.js
import { __ } from "@wordpress/i18n";
import Editor from "../editor/index.mjs";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import { jsx } from "react/jsx-runtime";
var attachmentItemRoute = {
  name: "attachment-item",
  path: "/attachment/:postId",
  areas: {
    sidebar: /* @__PURE__ */ jsx(
      SidebarNavigationScreen,
      {
        title: __("Media"),
        backPath: "/",
        content: null
      }
    ),
    mobile: /* @__PURE__ */ jsx(Editor, {}),
    preview: /* @__PURE__ */ jsx(Editor, {})
  }
};
export {
  attachmentItemRoute
};
//# sourceMappingURL=attachment-item.mjs.map
