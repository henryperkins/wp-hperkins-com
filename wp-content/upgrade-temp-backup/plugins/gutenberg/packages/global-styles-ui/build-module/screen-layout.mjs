// packages/global-styles-ui/src/screen-layout.tsx
import { __ } from "@wordpress/i18n";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { ScreenHeader } from "./screen-header.mjs";
import DimensionsPanel from "./dimensions-panel.mjs";
import { useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useHasDimensionsPanel, useSettingsForBlockElement } = unlock(
  blockEditorPrivateApis
);
function ScreenLayout() {
  const [rawSettings] = useSetting("");
  const settings = useSettingsForBlockElement(rawSettings);
  const hasDimensionsPanel = useHasDimensionsPanel(settings);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(ScreenHeader, { title: __("Layout") }),
    hasDimensionsPanel && /* @__PURE__ */ jsx(DimensionsPanel, {})
  ] });
}
var screen_layout_default = ScreenLayout;
export {
  screen_layout_default as default
};
//# sourceMappingURL=screen-layout.mjs.map
