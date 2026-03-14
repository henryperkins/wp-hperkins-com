// packages/edit-site/src/components/sidebar-dataviews/index.js
import { __experimentalItemGroup as ItemGroup } from "@wordpress/components";
import { privateApis as routerPrivateApis } from "@wordpress/router";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useMemo } from "@wordpress/element";
import { unlock } from "../../lock-unlock.mjs";
import DataViewItem from "./dataview-item.mjs";
import { getDefaultViews } from "../post-list/view-utils.mjs";
import { Fragment, jsx } from "react/jsx-runtime";
var { useLocation } = unlock(routerPrivateApis);
function DataViewsSidebarContent({ postType }) {
  const {
    query: { activeView = "all" }
  } = useLocation();
  const postTypeObject = useSelect(
    (select) => {
      const { getPostType } = select(coreStore);
      return getPostType(postType);
    },
    [postType]
  );
  const defaultViews = useMemo(
    () => getDefaultViews(postTypeObject),
    [postTypeObject]
  );
  if (!postType) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(ItemGroup, { className: "edit-site-sidebar-dataviews", children: defaultViews.map((dataview) => {
    return /* @__PURE__ */ jsx(
      DataViewItem,
      {
        slug: dataview.slug,
        title: dataview.title,
        icon: dataview.icon,
        type: dataview.view.type,
        isActive: dataview.slug === activeView
      },
      dataview.slug
    );
  }) }) });
}
export {
  DataViewsSidebarContent as default
};
//# sourceMappingURL=index.mjs.map
