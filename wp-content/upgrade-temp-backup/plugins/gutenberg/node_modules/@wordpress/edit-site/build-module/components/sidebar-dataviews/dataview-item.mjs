// packages/edit-site/src/components/sidebar-dataviews/dataview-item.js
import clsx from "clsx";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { __experimentalHStack as HStack } from "@wordpress/components";
import { VIEW_LAYOUTS } from "@wordpress/dataviews";
import { addQueryArgs } from "@wordpress/url";
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
function DataViewItem({
  title,
  slug,
  type,
  icon,
  isActive,
  suffix
}) {
  const { path } = useLocation();
  const iconToUse = icon || VIEW_LAYOUTS.find((v) => v.type === type).icon;
  if (slug === "all") {
    slug = void 0;
  }
  return /* @__PURE__ */ jsxs(
    HStack,
    {
      justify: "flex-start",
      className: clsx("edit-site-sidebar-dataviews-dataview-item", {
        "is-selected": isActive
      }),
      children: [
        /* @__PURE__ */ jsx(
          SidebarNavigationItem,
          {
            icon: iconToUse,
            to: addQueryArgs(path, {
              activeView: slug
            }),
            "aria-current": isActive ? "true" : void 0,
            children: title
          }
        ),
        suffix
      ]
    }
  );
}
export {
  DataViewItem as default
};
//# sourceMappingURL=dataview-item.mjs.map
