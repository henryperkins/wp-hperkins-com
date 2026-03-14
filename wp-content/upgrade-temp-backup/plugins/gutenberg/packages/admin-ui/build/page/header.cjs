"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/admin-ui/src/page/header.tsx
var header_exports = {};
__export(header_exports, {
  default: () => Header
});
module.exports = __toCommonJS(header_exports);
var import_ui = require("@wordpress/ui");
var import_sidebar_toggle_slot = require("./sidebar-toggle-slot.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function Header({
  breadcrumbs,
  badges,
  title,
  subTitle,
  actions,
  showSidebarToggle = true
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_ui.Stack,
    {
      direction: "column",
      className: "admin-ui-page__header",
      render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {}),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Stack, { direction: "row", justify: "space-between", gap: "sm", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_ui.Stack, { direction: "row", gap: "sm", align: "center", justify: "start", children: [
            showSidebarToggle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_sidebar_toggle_slot.SidebarToggleSlot,
              {
                bubblesVirtually: true,
                className: "admin-ui-page__sidebar-toggle-slot"
              }
            ),
            title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "admin-ui-page__header-title", children: title }),
            breadcrumbs,
            badges
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_ui.Stack,
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
        subTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "admin-ui-page__header-subtitle", children: subTitle })
      ]
    }
  );
}
//# sourceMappingURL=header.cjs.map
