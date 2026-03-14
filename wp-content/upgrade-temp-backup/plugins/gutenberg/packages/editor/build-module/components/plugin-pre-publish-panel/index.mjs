// packages/editor/src/components/plugin-pre-publish-panel/index.js
import { createSlotFill, PanelBody } from "@wordpress/components";
import { usePluginContext } from "@wordpress/plugins";
import { jsx } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill("PluginPrePublishPanel");
var PluginPrePublishPanel = ({
  children,
  className,
  title,
  initialOpen = false,
  icon
}) => {
  const { icon: pluginIcon } = usePluginContext();
  return /* @__PURE__ */ jsx(Fill, { children: /* @__PURE__ */ jsx(
    PanelBody,
    {
      className,
      initialOpen: initialOpen || !title,
      title,
      icon: icon ?? pluginIcon,
      children
    }
  ) });
};
PluginPrePublishPanel.Slot = Slot;
var plugin_pre_publish_panel_default = PluginPrePublishPanel;
export {
  plugin_pre_publish_panel_default as default
};
//# sourceMappingURL=index.mjs.map
