// packages/global-styles-ui/src/screen-css.tsx
import { __ } from "@wordpress/i18n";
import { ExternalLink } from "@wordpress/components";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { ScreenHeader } from "./screen-header.mjs";
import { useStyle } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { AdvancedPanel: StylesAdvancedPanel } = unlock(blockEditorPrivateApis);
function ScreenCSS() {
  const [style] = useStyle("", void 0, "user", false);
  const [inheritedStyle, setStyle] = useStyle(
    "",
    void 0,
    "merged",
    false
  );
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Additional CSS"),
        description: /* @__PURE__ */ jsxs(Fragment, { children: [
          __(
            "You can add custom CSS to further customize the appearance and layout of your site."
          ),
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx(
            ExternalLink,
            {
              href: __(
                "https://developer.wordpress.org/advanced-administration/wordpress/css/"
              ),
              className: "global-styles-ui-screen-css-help-link",
              children: __("Learn more about CSS")
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "global-styles-ui-screen-css", children: /* @__PURE__ */ jsx(
      StylesAdvancedPanel,
      {
        value: style,
        onChange: setStyle,
        inheritedValue: inheritedStyle
      }
    ) })
  ] });
}
var screen_css_default = ScreenCSS;
export {
  screen_css_default as default
};
//# sourceMappingURL=screen-css.mjs.map
