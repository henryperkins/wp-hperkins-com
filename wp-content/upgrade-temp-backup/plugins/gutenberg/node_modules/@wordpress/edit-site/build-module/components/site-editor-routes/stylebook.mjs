// packages/edit-site/src/components/site-editor-routes/stylebook.js
import { __ } from "@wordpress/i18n";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import SidebarNavigationScreen from "../sidebar-navigation-screen/index.mjs";
import SidebarNavigationScreenUnsupported from "../sidebar-navigation-screen-unsupported/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { isClassicThemeWithStyleBookSupport } from "./utils.mjs";
import { jsx } from "react/jsx-runtime";
var { StyleBookPreview } = unlock(editorPrivateApis);
var stylebookRoute = {
  name: "stylebook",
  path: "/stylebook",
  areas: {
    sidebar({ siteData }) {
      return isClassicThemeWithStyleBookSupport(siteData) ? /* @__PURE__ */ jsx(
        SidebarNavigationScreen,
        {
          title: __("Styles"),
          backPath: "/",
          description: __(
            `Preview your website's visual identity: colors, typography, and blocks.`
          )
        }
      ) : /* @__PURE__ */ jsx(SidebarNavigationScreenUnsupported, {});
    },
    preview({ siteData }) {
      return isClassicThemeWithStyleBookSupport(siteData) ? /* @__PURE__ */ jsx(StyleBookPreview, { isStatic: true }) : void 0;
    },
    mobile({ siteData }) {
      return isClassicThemeWithStyleBookSupport(siteData) ? /* @__PURE__ */ jsx(StyleBookPreview, { isStatic: true }) : void 0;
    }
  }
};
export {
  stylebookRoute
};
//# sourceMappingURL=stylebook.mjs.map
