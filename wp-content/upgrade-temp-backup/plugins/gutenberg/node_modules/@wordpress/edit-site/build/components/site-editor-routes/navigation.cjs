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

// packages/edit-site/src/components/site-editor-routes/navigation.js
var navigation_exports = {};
__export(navigation_exports, {
  navigationRoute: () => navigationRoute
});
module.exports = __toCommonJS(navigation_exports);
var import_router = require("@wordpress/router");
var import_editor = __toESM(require("../editor/index.cjs"));
var import_sidebar_navigation_screen_navigation_menus = __toESM(require("../sidebar-navigation-screen-navigation-menus/index.cjs"));
var import_sidebar_navigation_screen_unsupported = __toESM(require("../sidebar-navigation-screen-unsupported/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function MobileNavigationView() {
  const { query = {} } = useLocation();
  const { canvas = "view" } = query;
  return canvas === "edit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.default, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_navigation_menus.default, { backPath: "/" });
}
var navigationRoute = {
  name: "navigation",
  path: "/navigation",
  areas: {
    sidebar({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_navigation_menus.default, { backPath: "/" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_unsupported.default, {});
    },
    preview({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.default, {}) : void 0;
    },
    mobile({ siteData }) {
      const isBlockTheme = siteData.currentTheme?.is_block_theme;
      return isBlockTheme ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNavigationView, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_unsupported.default, {});
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  navigationRoute
});
//# sourceMappingURL=navigation.cjs.map
