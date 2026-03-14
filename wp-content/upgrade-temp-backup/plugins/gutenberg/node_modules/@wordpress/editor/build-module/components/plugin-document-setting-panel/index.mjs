// packages/editor/src/components/plugin-document-setting-panel/index.js
import { createSlotFill, PanelBody } from "@wordpress/components";
import { usePluginContext } from "@wordpress/plugins";
import { useDispatch, useSelect } from "@wordpress/data";
import warning from "@wordpress/warning";
import EnablePluginDocumentSettingPanelOption from "../preferences-modal/enable-plugin-document-setting-panel.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill("PluginDocumentSettingPanel");
var PluginDocumentSettingPanel = ({
  name,
  className,
  title,
  icon,
  children
}) => {
  const { name: pluginName } = usePluginContext();
  const panelName = `${pluginName}/${name}`;
  const { opened, isEnabled } = useSelect(
    (select) => {
      const { isEditorPanelOpened, isEditorPanelEnabled } = select(editorStore);
      return {
        opened: isEditorPanelOpened(panelName),
        isEnabled: isEditorPanelEnabled(panelName)
      };
    },
    [panelName]
  );
  const { toggleEditorPanelOpened } = useDispatch(editorStore);
  if (void 0 === name) {
    warning("PluginDocumentSettingPanel requires a name property.");
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      EnablePluginDocumentSettingPanelOption,
      {
        label: title,
        panelName
      }
    ),
    /* @__PURE__ */ jsx(Fill, { children: isEnabled && /* @__PURE__ */ jsx(
      PanelBody,
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
export {
  plugin_document_setting_panel_default as default
};
//# sourceMappingURL=index.mjs.map
