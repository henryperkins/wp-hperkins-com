// packages/editor/src/components/preferences-modal/enable-plugin-document-setting-panel.js
import { createSlotFill } from "@wordpress/components";
import EnablePanelOption from "./enable-panel.mjs";
import { jsx } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill(
  "EnablePluginDocumentSettingPanelOption"
);
var EnablePluginDocumentSettingPanelOption = ({ label, panelName }) => /* @__PURE__ */ jsx(Fill, { children: /* @__PURE__ */ jsx(EnablePanelOption, { label, panelName }) });
EnablePluginDocumentSettingPanelOption.Slot = Slot;
var enable_plugin_document_setting_panel_default = EnablePluginDocumentSettingPanelOption;
export {
  enable_plugin_document_setting_panel_default as default
};
//# sourceMappingURL=enable-plugin-document-setting-panel.mjs.map
