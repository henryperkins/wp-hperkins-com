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

// packages/editor/src/components/preferences-modal/enable-plugin-document-setting-panel.js
var enable_plugin_document_setting_panel_exports = {};
__export(enable_plugin_document_setting_panel_exports, {
  default: () => enable_plugin_document_setting_panel_default
});
module.exports = __toCommonJS(enable_plugin_document_setting_panel_exports);
var import_components = require("@wordpress/components");
var import_enable_panel = __toESM(require("./enable-panel.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill, Slot } = (0, import_components.createSlotFill)(
  "EnablePluginDocumentSettingPanelOption"
);
var EnablePluginDocumentSettingPanelOption = ({ label, panelName }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fill, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_enable_panel.default, { label, panelName }) });
EnablePluginDocumentSettingPanelOption.Slot = Slot;
var enable_plugin_document_setting_panel_default = EnablePluginDocumentSettingPanelOption;
//# sourceMappingURL=enable-plugin-document-setting-panel.cjs.map
