// packages/editor/src/components/post-excerpt/plugin.js
import { createSlotFill, PanelRow } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var { Fill, Slot } = createSlotFill("PluginPostExcerpt");
var PluginPostExcerpt = ({ children, className }) => {
  return /* @__PURE__ */ jsx(Fill, { children: /* @__PURE__ */ jsx(PanelRow, { className, children }) });
};
PluginPostExcerpt.Slot = Slot;
var plugin_default = PluginPostExcerpt;
export {
  plugin_default as default
};
//# sourceMappingURL=plugin.mjs.map
