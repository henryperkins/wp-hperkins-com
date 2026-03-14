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

// packages/editor/src/components/plugin-sidebar-more-menu-item/index.js
var plugin_sidebar_more_menu_item_exports = {};
__export(plugin_sidebar_more_menu_item_exports, {
  default: () => PluginSidebarMoreMenuItem
});
module.exports = __toCommonJS(plugin_sidebar_more_menu_item_exports);
var import_interface = require("@wordpress/interface");
var import_jsx_runtime = require("react/jsx-runtime");
function PluginSidebarMoreMenuItem(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_interface.ComplementaryAreaMoreMenuItem,
    {
      __unstableExplicitMenuItem: true,
      scope: "core",
      ...props
    }
  );
}
//# sourceMappingURL=index.cjs.map
