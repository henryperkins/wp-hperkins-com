// packages/admin-ui/src/page/index.tsx
import clsx from "clsx";
import Header from "./header.mjs";
import NavigableRegion from "../navigable-region/index.mjs";
import { SidebarToggleFill } from "./sidebar-toggle-slot.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function Page({
  breadcrumbs,
  badges,
  title,
  subTitle,
  children,
  className,
  actions,
  ariaLabel,
  hasPadding = false,
  showSidebarToggle = true
}) {
  const classes = clsx("admin-ui-page", className);
  const effectiveAriaLabel = ariaLabel ?? (typeof title === "string" ? title : "");
  return /* @__PURE__ */ jsxs(NavigableRegion, { className: classes, ariaLabel: effectiveAriaLabel, children: [
    (title || breadcrumbs || badges) && /* @__PURE__ */ jsx(
      Header,
      {
        breadcrumbs,
        badges,
        title,
        subTitle,
        actions,
        showSidebarToggle
      }
    ),
    hasPadding ? /* @__PURE__ */ jsx("div", { className: "admin-ui-page__content has-padding", children }) : children
  ] });
}
Page.SidebarToggleFill = SidebarToggleFill;
var page_default = Page;
export {
  page_default as default
};
//# sourceMappingURL=index.mjs.map
