// packages/edit-site/src/components/sidebar-navigation-screen-identity/index.js
import { __ } from "@wordpress/i18n";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { MainSidebarNavigationContent } from "../sidebar-navigation-screen-main/index.mjs";
import { jsx } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
function SidebarNavigationItemIdentity(props) {
  const { name } = useLocation();
  return /* @__PURE__ */ jsx(
    SidebarNavigationItem,
    {
      ...props,
      "aria-current": name === "identity"
    }
  );
}
function SidebarNavigationScreenIdentity() {
  return /* @__PURE__ */ jsx(
    SidebarNavigationScreen,
    {
      isRoot: true,
      title: __("Design"),
      description: __(
        "Customize the appearance of your website using the block editor."
      ),
      content: /* @__PURE__ */ jsx(MainSidebarNavigationContent, {})
    }
  );
}
export {
  SidebarNavigationItemIdentity,
  SidebarNavigationScreenIdentity as default
};
//# sourceMappingURL=index.mjs.map
