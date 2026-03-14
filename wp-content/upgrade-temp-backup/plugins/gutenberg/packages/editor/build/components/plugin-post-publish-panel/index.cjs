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

// packages/editor/src/components/plugin-post-publish-panel/index.js
var plugin_post_publish_panel_exports = {};
__export(plugin_post_publish_panel_exports, {
  default: () => plugin_post_publish_panel_default
});
module.exports = __toCommonJS(plugin_post_publish_panel_exports);
var import_plugins = require("@wordpress/plugins");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill, Slot } = (0, import_components.createSlotFill)("PluginPostPublishPanel");
var PluginPostPublishPanel = ({
  children,
  className,
  title,
  initialOpen = false,
  icon
}) => {
  const { icon: pluginIcon } = (0, import_plugins.usePluginContext)();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fill, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.PanelBody,
    {
      className,
      initialOpen: initialOpen || !title,
      title,
      icon: icon ?? pluginIcon,
      children
    }
  ) });
};
PluginPostPublishPanel.Slot = Slot;
var plugin_post_publish_panel_default = PluginPostPublishPanel;
//# sourceMappingURL=index.cjs.map
