// packages/edit-site/src/components/sidebar-navigation-screen-global-styles/content.js
import { __ } from "@wordpress/i18n";
import { __experimentalVStack as VStack } from "@wordpress/components";
import {
  StyleVariations,
  ColorVariations,
  TypographyVariations
} from "@wordpress/global-styles-ui";
import { privateApis as editorPrivateApis } from "@wordpress/editor";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useGlobalStyles } = unlock(editorPrivateApis);
function SidebarNavigationScreenGlobalStylesContent() {
  const gap = 3;
  const {
    user: userConfig,
    base: baseConfig,
    setUser: setUserConfig
  } = useGlobalStyles();
  return /* @__PURE__ */ jsxs(
    VStack,
    {
      spacing: 10,
      className: "edit-site-global-styles-variation-container",
      children: [
        /* @__PURE__ */ jsx(
          StyleVariations,
          {
            value: userConfig,
            baseValue: baseConfig || {},
            onChange: setUserConfig,
            gap
          }
        ),
        /* @__PURE__ */ jsx(
          ColorVariations,
          {
            value: userConfig,
            baseValue: baseConfig || {},
            onChange: setUserConfig,
            title: __("Palettes"),
            gap
          }
        ),
        /* @__PURE__ */ jsx(
          TypographyVariations,
          {
            value: userConfig,
            baseValue: baseConfig || {},
            onChange: setUserConfig,
            title: __("Typography"),
            gap
          }
        )
      ]
    }
  );
}
export {
  SidebarNavigationScreenGlobalStylesContent as default
};
//# sourceMappingURL=content.mjs.map
