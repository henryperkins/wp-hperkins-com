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

// packages/editor/src/components/global-styles-sidebar/default-sidebar.js
var default_sidebar_exports = {};
__export(default_sidebar_exports, {
  default: () => DefaultSidebar
});
module.exports = __toCommonJS(default_sidebar_exports);
var import_interface = require("@wordpress/interface");
var import_jsx_runtime = require("react/jsx-runtime");
function DefaultSidebar({
  className,
  identifier,
  title,
  icon,
  children,
  closeLabel,
  header,
  headerClassName,
  panelClassName,
  isActiveByDefault
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_interface.ComplementaryArea,
      {
        className,
        scope: "core",
        identifier,
        title,
        icon,
        closeLabel,
        header,
        headerClassName,
        panelClassName,
        isActiveByDefault,
        children
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_interface.ComplementaryAreaMoreMenuItem,
      {
        scope: "core",
        identifier,
        icon,
        children: title
      }
    )
  ] });
}
//# sourceMappingURL=default-sidebar.cjs.map
