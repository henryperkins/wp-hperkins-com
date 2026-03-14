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

// packages/edit-site/src/components/sidebar-navigation-screen-identity/index.js
var sidebar_navigation_screen_identity_exports = {};
__export(sidebar_navigation_screen_identity_exports, {
  SidebarNavigationItemIdentity: () => SidebarNavigationItemIdentity,
  default: () => SidebarNavigationScreenIdentity
});
module.exports = __toCommonJS(sidebar_navigation_screen_identity_exports);
var import_i18n = require("@wordpress/i18n");
var import_router = require("@wordpress/router");
var import_sidebar_navigation_screen = __toESM(require("../sidebar-navigation-screen/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_sidebar_navigation_item = __toESM(require("../sidebar-navigation-item/index.cjs"));
var import_sidebar_navigation_screen_main = require("../sidebar-navigation-screen-main/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useLocation } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function SidebarNavigationItemIdentity(props) {
  const { name } = useLocation();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_item.default,
    {
      ...props,
      "aria-current": name === "identity"
    }
  );
}
function SidebarNavigationScreenIdentity() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_screen.default,
    {
      isRoot: true,
      title: (0, import_i18n.__)("Design"),
      description: (0, import_i18n.__)(
        "Customize the appearance of your website using the block editor."
      ),
      content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_sidebar_navigation_screen_main.MainSidebarNavigationContent, {})
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SidebarNavigationItemIdentity
});
//# sourceMappingURL=index.cjs.map
