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

// packages/editor/src/components/plugin-post-status-info/index.js
var plugin_post_status_info_exports = {};
__export(plugin_post_status_info_exports, {
  default: () => plugin_post_status_info_default
});
module.exports = __toCommonJS(plugin_post_status_info_exports);
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill, Slot } = (0, import_components.createSlotFill)("PluginPostStatusInfo");
var PluginPostStatusInfo = ({ children, className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fill, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelRow, { className, children }) });
PluginPostStatusInfo.Slot = Slot;
var plugin_post_status_info_default = PluginPostStatusInfo;
//# sourceMappingURL=index.cjs.map
