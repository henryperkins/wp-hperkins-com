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

// packages/edit-site/src/components/sidebar-dataviews/dataview-item.js
var dataview_item_exports = {};
__export(dataview_item_exports, {
  default: () => DataViewItem
});
module.exports = __toCommonJS(dataview_item_exports);
var import_clsx = __toESM(require("clsx"));
var import_router = require("@wordpress/router");
var import_components = require("@wordpress/components");
var import_dataviews = require("@wordpress/dataviews");
var import_url = require("@wordpress/url");
var import_sidebar_navigation_item = __toESM(require("../sidebar-navigation-item/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function DataViewItem({
  title,
  slug,
  type,
  icon,
  isActive,
  suffix
}) {
  const { path } = useLocation();
  const iconToUse = icon || import_dataviews.VIEW_LAYOUTS.find((v) => v.type === type).icon;
  if (slug === "all") {
    slug = void 0;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalHStack,
    {
      justify: "flex-start",
      className: (0, import_clsx.default)("edit-site-sidebar-dataviews-dataview-item", {
        "is-selected": isActive
      }),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_sidebar_navigation_item.default,
          {
            icon: iconToUse,
            to: (0, import_url.addQueryArgs)(path, {
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
//# sourceMappingURL=dataview-item.cjs.map
