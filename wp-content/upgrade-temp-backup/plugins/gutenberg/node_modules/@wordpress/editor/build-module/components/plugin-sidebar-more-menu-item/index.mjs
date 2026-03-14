// packages/editor/src/components/plugin-sidebar-more-menu-item/index.js
import { ComplementaryAreaMoreMenuItem } from "@wordpress/interface";
import { jsx } from "react/jsx-runtime";
function PluginSidebarMoreMenuItem(props) {
  return /* @__PURE__ */ jsx(
    ComplementaryAreaMoreMenuItem,
    {
      __unstableExplicitMenuItem: true,
      scope: "core",
      ...props
    }
  );
}
export {
  PluginSidebarMoreMenuItem as default
};
//# sourceMappingURL=index.mjs.map
