// packages/editor/src/components/plugin-post-publish-panel/index.js
import { usePluginContext } from "@wordpress/plugins";
import { createSlotFill, PanelBody } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill("PluginPostPublishPanel");
var PluginPostPublishPanel = ({
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
PluginPostPublishPanel.Slot = Slot;
var plugin_post_publish_panel_default = PluginPostPublishPanel;
export {
  plugin_post_publish_panel_default as default
};
//# sourceMappingURL=index.mjs.map
