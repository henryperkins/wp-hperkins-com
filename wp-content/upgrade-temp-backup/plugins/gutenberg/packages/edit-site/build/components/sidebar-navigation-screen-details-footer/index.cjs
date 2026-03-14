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

// packages/edit-site/src/components/sidebar-navigation-screen-details-footer/index.js
var sidebar_navigation_screen_details_footer_exports = {};
__export(sidebar_navigation_screen_details_footer_exports, {
  default: () => SidebarNavigationScreenDetailsFooter
});
module.exports = __toCommonJS(sidebar_navigation_screen_details_footer_exports);
var import_i18n = require("@wordpress/i18n");
var import_url = require("@wordpress/url");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_sidebar_navigation_item = __toESM(require("../sidebar-navigation-item/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function SidebarNavigationScreenDetailsFooter({
  record,
  revisionsCount,
  ...otherProps
}) {
  const hrefProps = {};
  const lastRevisionId = record?._links?.["predecessor-version"]?.[0]?.id ?? null;
  revisionsCount = revisionsCount || record?._links?.["version-history"]?.[0]?.count || 0;
  if (lastRevisionId && revisionsCount > 1) {
    hrefProps.href = (0, import_url.addQueryArgs)("revision.php", {
      revision: record?._links["predecessor-version"][0].id
    });
    hrefProps.as = "a";
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalItemGroup,
    {
      size: "large",
      className: "edit-site-sidebar-navigation-screen-details-footer",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_sidebar_navigation_item.default,
        {
          icon: import_icons.backup,
          ...hrefProps,
          ...otherProps,
          children: (0, import_i18n.sprintf)(
            /* translators: %d: Number of Styles revisions. */
            (0, import_i18n._n)("%d Revision", "%d Revisions", revisionsCount),
            revisionsCount
          )
        }
      )
    }
  );
}
//# sourceMappingURL=index.cjs.map
