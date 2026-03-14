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

// packages/edit-site/src/components/sidebar-dataviews/index.js
var sidebar_dataviews_exports = {};
__export(sidebar_dataviews_exports, {
  default: () => DataViewsSidebarContent
});
module.exports = __toCommonJS(sidebar_dataviews_exports);
var import_components = require("@wordpress/components");
var import_router = require("@wordpress/router");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_dataview_item = __toESM(require("./dataview-item.cjs"));
var import_view_utils = require("../post-list/view-utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function DataViewsSidebarContent({ postType }) {
  const {
    query: { activeView = "all" }
  } = useLocation();
  const postTypeObject = (0, import_data.useSelect)(
    (select) => {
      const { getPostType } = select(import_core_data.store);
      return getPostType(postType);
    },
    [postType]
  );
  const defaultViews = (0, import_element.useMemo)(
    () => (0, import_view_utils.getDefaultViews)(postTypeObject),
    [postTypeObject]
  );
  if (!postType) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { className: "edit-site-sidebar-dataviews", children: defaultViews.map((dataview) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_dataview_item.default,
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
//# sourceMappingURL=index.cjs.map
