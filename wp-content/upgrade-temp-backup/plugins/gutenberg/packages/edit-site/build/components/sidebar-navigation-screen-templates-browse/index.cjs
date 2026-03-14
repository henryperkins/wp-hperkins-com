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

// packages/edit-site/src/components/sidebar-navigation-screen-templates-browse/index.js
var sidebar_navigation_screen_templates_browse_exports = {};
__export(sidebar_navigation_screen_templates_browse_exports, {
  default: () => SidebarNavigationScreenTemplatesBrowse
});
module.exports = __toCommonJS(sidebar_navigation_screen_templates_browse_exports);
var import_i18n = require("@wordpress/i18n");
var import_sidebar_navigation_screen = __toESM(require("../sidebar-navigation-screen/index.cjs"));
var import_content = __toESM(require("./content.cjs"));
var import_content_legacy = __toESM(require("./content-legacy.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function SidebarNavigationScreenTemplatesBrowse({ backPath }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_sidebar_navigation_screen.default,
    {
      title: (0, import_i18n.__)("Templates"),
      description: (0, import_i18n.__)(
        "Create new templates, or reset any customizations made to the templates supplied by your theme."
      ),
      backPath,
      content: window?.__experimentalTemplateActivate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_content.default, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_content_legacy.default, {})
    }
  );
}
//# sourceMappingURL=index.cjs.map
