// packages/admin-ui/src/page/header.tsx
import { Stack } from "@wordpress/ui";
import { SidebarToggleSlot } from "./sidebar-toggle-slot.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function Header({
  breadcrumbs,
  badges,
  title,
  subTitle,
  actions,
  showSidebarToggle = true
}) {
  return /* @__PURE__ */ jsxs(
    Stack,
    {
      direction: "column",
      className: "admin-ui-page__header",
      render: /* @__PURE__ */ jsx("header", {}),
      children: [
        /* @__PURE__ */ jsxs(Stack, { direction: "row", justify: "space-between", gap: "sm", children: [
          /* @__PURE__ */ jsxs(Stack, { direction: "row", gap: "sm", align: "center", justify: "start", children: [
            showSidebarToggle && /* @__PURE__ */ jsx(
              SidebarToggleSlot,
              {
                bubblesVirtually: true,
                className: "admin-ui-page__sidebar-toggle-slot"
              }
            ),
            title && /* @__PURE__ */ jsx("h2", { className: "admin-ui-page__header-title", children: title }),
            breadcrumbs,
            badges
          ] }),
          /* @__PURE__ */ jsx(
            Stack,
            {
              direction: "row",
              gap: "sm",
              style: { width: "auto", flexShrink: 0 },
              className: "admin-ui-page__header-actions",
              align: "center",
              children: actions
            }
          )
        ] }),
        subTitle && /* @__PURE__ */ jsx("p", { className: "admin-ui-page__header-subtitle", children: subTitle })
      ]
    }
  );
}
export {
  Header as default
};
//# sourceMappingURL=header.mjs.map
