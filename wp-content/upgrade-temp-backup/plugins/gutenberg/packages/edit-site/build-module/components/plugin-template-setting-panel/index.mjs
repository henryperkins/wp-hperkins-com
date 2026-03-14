// packages/edit-site/src/components/plugin-template-setting-panel/index.js
import { store as editorStore } from "@wordpress/editor";
import { useSelect } from "@wordpress/data";
import { createSlotFill } from "@wordpress/components";
import deprecated from "@wordpress/deprecated";
import { jsx } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill("PluginTemplateSettingPanel");
var PluginTemplateSettingPanel = ({ children }) => {
  deprecated("wp.editSite.PluginTemplateSettingPanel", {
    since: "6.6",
    version: "6.8",
    alternative: "wp.editor.PluginDocumentSettingPanel"
  });
  const isCurrentEntityTemplate = useSelect(
    (select) => select(editorStore).getCurrentPostType() === "wp_template",
    []
  );
  if (!isCurrentEntityTemplate) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fill, { children });
};
PluginTemplateSettingPanel.Slot = Slot;
var plugin_template_setting_panel_default = PluginTemplateSettingPanel;
export {
  plugin_template_setting_panel_default as default
};
//# sourceMappingURL=index.mjs.map
