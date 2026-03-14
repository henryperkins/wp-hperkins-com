// packages/edit-site/src/components/site-editor-routes/notfound.js
import { __ } from "@wordpress/i18n";
import { Notice, __experimentalSpacer as Spacer } from "@wordpress/components";
import SidebarNavigationScreenMain from "../sidebar-navigation-screen-main/index.mjs";
import { jsx } from "react/jsx-runtime";
function NotFoundError() {
  return /* @__PURE__ */ jsx(Notice, { status: "error", isDismissible: false, children: __(
    "The requested page could not be found. Please check the URL."
  ) });
}
var notFoundRoute = {
  name: "notfound",
  path: "*",
  areas: {
    sidebar: /* @__PURE__ */ jsx(SidebarNavigationScreenMain, {}),
    mobile: /* @__PURE__ */ jsx(
      SidebarNavigationScreenMain,
      {
        customDescription: /* @__PURE__ */ jsx(NotFoundError, {})
      }
    ),
    content: /* @__PURE__ */ jsx(Spacer, { padding: 2, children: /* @__PURE__ */ jsx(NotFoundError, {}) })
  }
};
export {
  notFoundRoute
};
//# sourceMappingURL=notfound.mjs.map
