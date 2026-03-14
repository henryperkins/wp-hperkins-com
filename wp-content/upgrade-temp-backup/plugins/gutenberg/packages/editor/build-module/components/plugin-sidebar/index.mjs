// packages/editor/src/components/plugin-sidebar/index.js
import { ComplementaryArea } from "@wordpress/interface";
import { jsx } from "react/jsx-runtime";
function PluginSidebar({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    ComplementaryArea,
    {
      panelClassName: className,
      className: "editor-sidebar",
      scope: "core",
      ...props
    }
  );
}
export {
  PluginSidebar as default
};
//# sourceMappingURL=index.mjs.map
