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

// packages/edit-site/src/components/sidebar-navigation-screen-unsupported/index.js
var sidebar_navigation_screen_unsupported_exports = {};
__export(sidebar_navigation_screen_unsupported_exports, {
  default: () => SidebarNavigationScreenUnsupported
});
module.exports = __toCommonJS(sidebar_navigation_screen_unsupported_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function SidebarNavigationScreenUnsupported() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { padding: 3, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Notice, { status: "warning", isDismissible: false, children: (0, import_i18n.__)(
    "The theme you are currently using does not support this screen."
  ) }) });
}
//# sourceMappingURL=index.cjs.map
