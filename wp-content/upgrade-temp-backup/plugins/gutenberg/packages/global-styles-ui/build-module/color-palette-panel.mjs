// packages/global-styles-ui/src/color-palette-panel.tsx
import { useViewportMatch } from "@wordpress/compose";
import {
  __experimentalPaletteEdit as PaletteEdit,
  __experimentalVStack as VStack,
  Button
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { shuffle } from "@wordpress/icons";
import { useSetting, useColorRandomizer } from "./hooks.mjs";
import ColorVariations from "./variations/variations-color.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var mobilePopoverProps = { placement: "bottom-start", offset: 8 };
function ColorPalettePanel({ name }) {
  const [themeColors, setThemeColors] = useSetting(
    "color.palette.theme",
    name
  );
  const [baseThemeColors] = useSetting(
    "color.palette.theme",
    name,
    "base"
  );
  const [defaultColors, setDefaultColors] = useSetting(
    "color.palette.default",
    name
  );
  const [baseDefaultColors] = useSetting(
    "color.palette.default",
    name,
    "base"
  );
  const [customColors, setCustomColors] = useSetting(
    "color.palette.custom",
    name
  );
  const [defaultPaletteEnabled] = useSetting(
    "color.defaultPalette",
    name
  );
  const isMobileViewport = useViewportMatch("small", "<");
  const popoverProps = isMobileViewport ? mobilePopoverProps : void 0;
  const [randomizeThemeColors] = useColorRandomizer(name);
  return /* @__PURE__ */ jsxs(VStack, { className: "global-styles-ui-color-palette-panel", spacing: 8, children: [
    /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
      !!themeColors && !!themeColors.length && /* @__PURE__ */ jsx(
        PaletteEdit,
        {
          canReset: themeColors !== baseThemeColors,
          canOnlyChangeValues: true,
          colors: themeColors,
          onChange: setThemeColors,
          paletteLabel: __("Theme"),
          paletteLabelHeadingLevel: 3,
          popoverProps
        }
      ),
      window.__experimentalEnableColorRandomizer && themeColors?.length > 0 && randomizeThemeColors && /* @__PURE__ */ jsx(
        Button,
        {
          __next40pxDefaultSize: true,
          variant: "secondary",
          icon: shuffle,
          onClick: randomizeThemeColors,
          children: __("Randomize colors")
        }
      )
    ] }),
    !!defaultColors && !!defaultColors.length && !!defaultPaletteEnabled && /* @__PURE__ */ jsx(
      PaletteEdit,
      {
        canReset: defaultColors !== baseDefaultColors,
        canOnlyChangeValues: true,
        colors: defaultColors,
        onChange: setDefaultColors,
        paletteLabel: __("Default"),
        paletteLabelHeadingLevel: 3,
        popoverProps
      }
    ),
    /* @__PURE__ */ jsx(
      PaletteEdit,
      {
        colors: customColors,
        onChange: setCustomColors,
        paletteLabel: __("Custom"),
        paletteLabelHeadingLevel: 3,
        slugPrefix: "custom-",
        popoverProps
      }
    ),
    /* @__PURE__ */ jsx(ColorVariations, { title: __("Palettes") })
  ] });
}
export {
  ColorPalettePanel as default
};
//# sourceMappingURL=color-palette-panel.mjs.map
