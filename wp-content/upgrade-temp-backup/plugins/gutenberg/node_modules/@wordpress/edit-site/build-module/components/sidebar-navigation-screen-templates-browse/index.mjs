// packages/edit-site/src/components/sidebar-navigation-screen-templates-browse/index.js
import { __ } from "@wordpress/i18n";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import DataviewsTemplatesSidebarContent from "./content.mjs";
import DataviewsTemplatesSidebarContentLegacy from "./content-legacy.mjs";
import { jsx } from "react/jsx-runtime";
function SidebarNavigationScreenTemplatesBrowse({ backPath }) {
  return /* @__PURE__ */ jsx(
    SidebarNavigationScreen,
    {
      title: __("Templates"),
      description: __(
        "Create new templates, or reset any customizations made to the templates supplied by your theme."
      ),
      backPath,
      content: window?.__experimentalTemplateActivate ? /* @__PURE__ */ jsx(DataviewsTemplatesSidebarContent, {}) : /* @__PURE__ */ jsx(DataviewsTemplatesSidebarContentLegacy, {})
    }
  );
}
export {
  SidebarNavigationScreenTemplatesBrowse as default
};
//# sourceMappingURL=index.mjs.map
