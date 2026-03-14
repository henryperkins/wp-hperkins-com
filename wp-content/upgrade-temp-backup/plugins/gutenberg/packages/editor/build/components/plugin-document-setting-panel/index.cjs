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

// packages/editor/src/components/plugin-document-setting-panel/index.js
var plugin_document_setting_panel_exports = {};
__export(plugin_document_setting_panel_exports, {
  default: () => plugin_document_setting_panel_default
});
module.exports = __toCommonJS(plugin_document_setting_panel_exports);
var import_components = require("@wordpress/components");
var import_plugins = require("@wordpress/plugins");
var import_data = require("@wordpress/data");
var import_warning = __toESM(require("@wordpress/warning"));
var import_enable_plugin_document_setting_panel = __toESM(require("../preferences-modal/enable-plugin-document-setting-panel.cjs"));
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill, Slot } = (0, import_components.createSlotFill)("PluginDocumentSettingPanel");
var PluginDocumentSettingPanel = ({
  name,
  className,
  title,
  icon,
  children
}) => {
  const { name: pluginName } = (0, import_plugins.usePluginContext)();
  const panelName = `${pluginName}/${name}`;
  const { opened, isEnabled } = (0, import_data.useSelect)(
    (select) => {
      const { isEditorPanelOpened, isEditorPanelEnabled } = select(import_store.store);
      return {
        opened: isEditorPanelOpened(panelName),
        isEnabled: isEditorPanelEnabled(panelName)
      };
    },
    [panelName]
  );
  const { toggleEditorPanelOpened } = (0, import_data.useDispatch)(import_store.store);
  if (void 0 === name) {
    (0, import_warning.default)("PluginDocumentSettingPanel requires a name property.");
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_enable_plugin_document_setting_panel.default,
      {
        label: title,
        panelName
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fill, { children: isEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.PanelBody,
      {
        className,
        title,
        icon,
        opened,
        onToggle: () => toggleEditorPanelOpened(panelName),
        children
      }
    ) })
  ] });
};
PluginDocumentSettingPanel.Slot = Slot;
var plugin_document_setting_panel_default = PluginDocumentSettingPanel;
//# sourceMappingURL=index.cjs.map
