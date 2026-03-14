// packages/editor/src/components/plugin-post-status-info/index.js
import { createSlotFill, PanelRow } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill("PluginPostStatusInfo");
var PluginPostStatusInfo = ({ children, className }) => /* @__PURE__ */ jsx(Fill, { children: /* @__PURE__ */ jsx(PanelRow, { className, children }) });
PluginPostStatusInfo.Slot = Slot;
var plugin_post_status_info_default = PluginPostStatusInfo;
export {
  plugin_post_status_info_default as default
};
//# sourceMappingURL=index.mjs.map
