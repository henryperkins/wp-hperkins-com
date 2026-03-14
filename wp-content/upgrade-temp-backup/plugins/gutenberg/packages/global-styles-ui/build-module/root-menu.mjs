// packages/global-styles-ui/src/root-menu.tsx
import { __experimentalItemGroup as ItemGroup } from "@wordpress/components";
import {
  background,
  typography,
  color,
  layout,
  shadow as shadowIcon
} from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { NavigationButtonAsItem } from "./navigation-button.mjs";
import { useSetting } from "./hooks.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var {
  useHasDimensionsPanel,
  useHasTypographyPanel,
  useHasColorPanel,
  useSettingsForBlockElement,
  useHasBackgroundPanel
} = unlock(blockEditorPrivateApis);
function RootMenu() {
  const [rawSettings] = useSetting("");
  const settings = useSettingsForBlockElement(rawSettings);
  const hasBackgroundPanel = useHasBackgroundPanel(rawSettings);
  const hasTypographyPanel = useHasTypographyPanel(settings);
  const hasColorPanel = useHasColorPanel(settings);
  const hasShadowPanel = true;
  const hasDimensionsPanel = useHasDimensionsPanel(settings);
  const hasLayoutPanel = hasDimensionsPanel;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(ItemGroup, { children: [
    hasTypographyPanel && /* @__PURE__ */ jsx(
      NavigationButtonAsItem,
      {
        icon: typography,
        path: "/typography",
        children: __("Typography")
      }
    ),
    hasColorPanel && /* @__PURE__ */ jsx(NavigationButtonAsItem, { icon: color, path: "/colors", children: __("Colors") }),
    hasBackgroundPanel && /* @__PURE__ */ jsx(
      NavigationButtonAsItem,
      {
        icon: background,
        path: "/background",
        "aria-label": __("Background styles"),
        children: __("Background")
      }
    ),
    hasShadowPanel && /* @__PURE__ */ jsx(NavigationButtonAsItem, { icon: shadowIcon, path: "/shadows", children: __("Shadows") }),
    hasLayoutPanel && /* @__PURE__ */ jsx(NavigationButtonAsItem, { icon: layout, path: "/layout", children: __("Layout") })
  ] }) });
}
var root_menu_default = RootMenu;
export {
  root_menu_default as default
};
//# sourceMappingURL=root-menu.mjs.map
