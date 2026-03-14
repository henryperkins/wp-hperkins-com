// packages/global-styles-ui/src/screen-background.tsx
import { __ } from "@wordpress/i18n";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { __experimentalText as Text } from "@wordpress/components";
import BackgroundPanel from "./background-panel.mjs";
import { ScreenHeader } from "./screen-header.mjs";
import { useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useHasBackgroundPanel } = unlock(blockEditorPrivateApis);
function ScreenBackground() {
  const [settings] = useSetting("");
  const hasBackgroundPanel = useHasBackgroundPanel(settings);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Background"),
        description: /* @__PURE__ */ jsx(Text, { children: __("Set styles for the site's background.") })
      }
    ),
    hasBackgroundPanel && /* @__PURE__ */ jsx(BackgroundPanel, {})
  ] });
}
var screen_background_default = ScreenBackground;
export {
  screen_background_default as default
};
//# sourceMappingURL=screen-background.mjs.map
