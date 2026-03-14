// packages/global-styles-ui/src/screen-color-palette.tsx
import { __ } from "@wordpress/i18n";
import { privateApis as componentsPrivateApis } from "@wordpress/components";
import { ScreenHeader } from "./screen-header.mjs";
import ColorPalettePanel from "./color-palette-panel.mjs";
import GradientPalettePanel from "./gradients-palette-panel.mjs";
import { unlock } from "./lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { Tabs } = unlock(componentsPrivateApis);
function ScreenColorPalette({ name }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      ScreenHeader,
      {
        title: __("Edit palette"),
        description: __(
          "The combination of colors used across the site and in color pickers."
        )
      }
    ),
    /* @__PURE__ */ jsxs(Tabs, { children: [
      /* @__PURE__ */ jsxs(Tabs.TabList, { children: [
        /* @__PURE__ */ jsx(Tabs.Tab, { tabId: "color", children: __("Color") }),
        /* @__PURE__ */ jsx(Tabs.Tab, { tabId: "gradient", children: __("Gradient") })
      ] }),
      /* @__PURE__ */ jsx(Tabs.TabPanel, { tabId: "color", focusable: false, children: /* @__PURE__ */ jsx(ColorPalettePanel, { name }) }),
      /* @__PURE__ */ jsx(Tabs.TabPanel, { tabId: "gradient", focusable: false, children: /* @__PURE__ */ jsx(GradientPalettePanel, { name }) })
    ] })
  ] });
}
var screen_color_palette_default = ScreenColorPalette;
export {
  screen_color_palette_default as default
};
//# sourceMappingURL=screen-color-palette.mjs.map
