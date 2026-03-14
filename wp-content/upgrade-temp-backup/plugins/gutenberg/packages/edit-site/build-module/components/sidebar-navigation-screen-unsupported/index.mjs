// packages/edit-site/src/components/sidebar-navigation-screen-unsupported/index.js
import { __ } from "@wordpress/i18n";
import { Notice, __experimentalSpacer as Spacer } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function SidebarNavigationScreenUnsupported() {
  return /* @__PURE__ */ jsx(Spacer, { padding: 3, children: /* @__PURE__ */ jsx(Notice, { status: "warning", isDismissible: false, children: __(
    "The theme you are currently using does not support this screen."
  ) }) });
}
export {
  SidebarNavigationScreenUnsupported as default
};
//# sourceMappingURL=index.mjs.map
