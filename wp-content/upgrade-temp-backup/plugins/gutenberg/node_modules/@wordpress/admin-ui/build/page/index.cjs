"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/admin-ui/src/page/index.tsx
var page_exports = {};
__export(page_exports, {
  default: () => page_default
});
module.exports = __toCommonJS(page_exports);
var import_clsx = __toESM(require("clsx"));
var import_header = __toESM(require("./header.cjs"));
var import_navigable_region = __toESM(require("../navigable-region/index.cjs"));
var import_sidebar_toggle_slot = require("./sidebar-toggle-slot.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const classes = (0, import_clsx.default)("admin-ui-page", className);
  const effectiveAriaLabel = ariaLabel ?? (typeof title === "string" ? title : "");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_navigable_region.default, { className: classes, ariaLabel: effectiveAriaLabel, children: [
    (title || breadcrumbs || badges) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_header.default,
      {
        breadcrumbs,
        badges,
        title,
        subTitle,
        actions,
        showSidebarToggle
      }
    ),
    hasPadding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "admin-ui-page__content has-padding", children }) : children
  ] });
}
Page.SidebarToggleFill = import_sidebar_toggle_slot.SidebarToggleFill;
var page_default = Page;
//# sourceMappingURL=index.cjs.map
