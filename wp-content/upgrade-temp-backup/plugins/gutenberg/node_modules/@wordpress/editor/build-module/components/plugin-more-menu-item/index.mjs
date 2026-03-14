// packages/editor/src/components/plugin-more-menu-item/index.js
import { MenuItem } from "@wordpress/components";
import { usePluginContext } from "@wordpress/plugins";
import { ActionItem } from "@wordpress/interface";
import { jsx } from "react/jsx-runtime";
function PluginMoreMenuItem(props) {
  const context = usePluginContext();
  return /* @__PURE__ */ jsx(
    ActionItem,
    {
      name: "core/plugin-more-menu",
      as: props.as ?? MenuItem,
      icon: props.icon || context.icon,
      ...props
    }
  );
}
export {
  PluginMoreMenuItem as default
};
//# sourceMappingURL=index.mjs.map
