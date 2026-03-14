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

// packages/edit-site/src/components/plugin-template-setting-panel/index.js
var plugin_template_setting_panel_exports = {};
__export(plugin_template_setting_panel_exports, {
  default: () => plugin_template_setting_panel_default
});
module.exports = __toCommonJS(plugin_template_setting_panel_exports);
var import_editor = require("@wordpress/editor");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill, Slot } = (0, import_components.createSlotFill)("PluginTemplateSettingPanel");
var PluginTemplateSettingPanel = ({ children }) => {
  (0, import_deprecated.default)("wp.editSite.PluginTemplateSettingPanel", {
    since: "6.6",
    version: "6.8",
    alternative: "wp.editor.PluginDocumentSettingPanel"
  });
  const isCurrentEntityTemplate = (0, import_data.useSelect)(
    (select) => select(import_editor.store).getCurrentPostType() === "wp_template",
    []
  );
  if (!isCurrentEntityTemplate) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fill, { children });
};
PluginTemplateSettingPanel.Slot = Slot;
var plugin_template_setting_panel_default = PluginTemplateSettingPanel;
//# sourceMappingURL=index.cjs.map
