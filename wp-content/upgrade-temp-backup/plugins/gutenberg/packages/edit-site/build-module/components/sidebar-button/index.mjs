// packages/edit-site/src/components/sidebar-button/index.js
import clsx from "clsx";
import { Button } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function SidebarButton(props) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      size: "compact",
      ...props,
      className: clsx("edit-site-sidebar-button", props.className)
    }
  );
}
export {
  SidebarButton as default
};
//# sourceMappingURL=index.mjs.map
