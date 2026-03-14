// packages/edit-site/src/components/sidebar-navigation-screen-patterns/category-item.js
import SidebarNavigationItem from "../sidebar-navigation-item/index.mjs";
import { jsx } from "react/jsx-runtime";
function CategoryItem({
  count,
  icon,
  id,
  isActive,
  label,
  type
}) {
  if (!count) {
    return;
  }
  const queryArgs = [`postType=${type}`];
  if (id) {
    queryArgs.push(`categoryId=${id}`);
  }
  return /* @__PURE__ */ jsx(
    SidebarNavigationItem,
    {
      icon,
      suffix: /* @__PURE__ */ jsx("span", { children: count }),
      "aria-current": isActive ? "true" : void 0,
      to: `/pattern?${queryArgs.join("&")}`,
      children: label
    }
  );
}
export {
  CategoryItem as default
};
//# sourceMappingURL=category-item.mjs.map
