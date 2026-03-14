// packages/edit-site/src/components/site-editor-routes/identity.js
import { privateApis as routerPrivateApis } from "@wordpress/router";
import Editor from "../editor/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import SidebarNavigationScreenIdentity from "../sidebar-navigation-screen-identity/index.mjs";
import SidebarIdentity from "../sidebar-identity/index.mjs";
import { jsx } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
function MobileIdentityView() {
  const { query = {} } = useLocation();
  const { canvas } = query;
  if (canvas === "edit") {
    return /* @__PURE__ */ jsx(Editor, {});
  }
  return /* @__PURE__ */ jsx(SidebarIdentity, {});
}
var identityRoute = {
  name: "identity",
  path: "/identity",
  areas: {
    sidebar: /* @__PURE__ */ jsx(SidebarNavigationScreenIdentity, {}),
    content: /* @__PURE__ */ jsx(SidebarIdentity, {}),
    preview: /* @__PURE__ */ jsx(Editor, {}),
    mobile: /* @__PURE__ */ jsx(MobileIdentityView, {})
  },
  widths: {
    content: 380
  }
};
export {
  identityRoute
};
//# sourceMappingURL=identity.mjs.map
