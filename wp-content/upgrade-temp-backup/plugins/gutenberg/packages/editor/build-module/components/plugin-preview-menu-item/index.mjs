// packages/editor/src/components/plugin-preview-menu-item/index.js
import { MenuItem } from "@wordpress/components";
import { usePluginContext } from "@wordpress/plugins";
import { ActionItem } from "@wordpress/interface";
import { jsx } from "react/jsx-runtime";
function PluginPreviewMenuItem(props) {
  const context = usePluginContext();
  return /* @__PURE__ */ jsx(
    ActionItem,
    {
      name: "core/plugin-preview-menu",
      as: props.as ?? MenuItem,
      icon: props.icon || context.icon,
      ...props
    }
  );
}
export {
  PluginPreviewMenuItem as default
};
//# sourceMappingURL=index.mjs.map
