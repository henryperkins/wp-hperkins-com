// packages/global-styles-ui/src/screen-colors.tsx
import { __ } from "@wordpress/i18n";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { ScreenHeader } from "./screen-header.mjs";
import { ScreenBody } from "./screen-body.mjs";
import Palette from "./palette.mjs";
import { useStyle, useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useSettingsForBlockElement, ColorPanel: StylesColorPanel } = unlock(
  blockEditorPrivateApis
);
function ScreenColors() {
  const [style, setStyle] = useStyle(
    "",
    void 0,
    "user",
    false
  );
  const [inheritedStyle] = useStyle(
    "",
    void 0,
    "merged",
    false
  );
  const [rawSettings] = useSetting("");
  const settings = useSettingsForBlockElement(rawSettings);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Colors"),
        description: __(
          "Palette colors and the application of those colors on site elements."
        )
      }
    ),
    /* @__PURE__ */ jsx(ScreenBody, { children: /* @__PURE__ */ jsx(VStack, { spacing: 7, children: /* @__PURE__ */ jsx(Palette, {}) }) }),
    /* @__PURE__ */ jsx(
      StylesColorPanel,
      {
        inheritedValue: inheritedStyle,
        value: style,
        onChange: setStyle,
        settings
      }
    )
  ] });
}
var screen_colors_default = ScreenColors;
export {
  screen_colors_default as default
};
//# sourceMappingURL=screen-colors.mjs.map
