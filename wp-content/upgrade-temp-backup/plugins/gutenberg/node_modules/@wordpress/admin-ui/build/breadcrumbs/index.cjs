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

// packages/admin-ui/src/breadcrumbs/index.tsx
var breadcrumbs_exports = {};
__export(breadcrumbs_exports, {
  Breadcrumbs: () => Breadcrumbs,
  default: () => breadcrumbs_default
});
module.exports = __toCommonJS(breadcrumbs_exports);
var import_route = require("@wordpress/route");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var BreadcrumbItem = ({
  item: { label, to }
}) => {
  if (!to) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHeading, { level: 1, truncate: true, children: label }) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_route.Link, { to, children: label }) });
};
var Breadcrumbs = ({ items }) => {
  if (!items.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { "aria-label": (0, import_i18n.__)("Breadcrumbs"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalHStack,
    {
      as: "ul",
      className: "admin-ui-breadcrumbs__list",
      spacing: 0,
      justify: "flex-start",
      alignment: "center",
      children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { item }, index))
    }
  ) });
};
var breadcrumbs_default = Breadcrumbs;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Breadcrumbs
});
//# sourceMappingURL=index.cjs.map
