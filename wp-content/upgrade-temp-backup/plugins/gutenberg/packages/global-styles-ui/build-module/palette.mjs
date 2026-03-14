// packages/global-styles-ui/src/palette.tsx
import {
  __experimentalItemGroup as ItemGroup,
  FlexItem,
  __experimentalHStack as HStack,
  __experimentalZStack as ZStack,
  __experimentalVStack as VStack,
  ColorIndicator
} from "@wordpress/components";
import { isRTL, __ } from "@wordpress/i18n";
import { Icon, chevronLeft, chevronRight } from "@wordpress/icons";
import { useMemo } from "@wordpress/element";
import { Subtitle } from "./subtitle.mjs";
import { NavigationButtonAsItem } from "./navigation-button.mjs";
import ColorIndicatorWrapper from "./color-indicator-wrapper.mjs";
import { useSetting } from "./hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var EMPTY_COLORS = [];
function Palette({ name }) {
  const [customColors] = useSetting("color.palette.custom");
  const [themeColors] = useSetting("color.palette.theme");
  const [defaultColors] = useSetting("color.palette.default");
  const [defaultPaletteEnabled] = useSetting(
    "color.defaultPalette",
    name
  );
  const safeCustomColors = customColors || EMPTY_COLORS;
  const safeThemeColors = themeColors || EMPTY_COLORS;
  const safeDefaultColors = defaultColors || EMPTY_COLORS;
  const safeDefaultPaletteEnabled = defaultPaletteEnabled ?? true;
  const colors = useMemo(
    () => [
      ...safeCustomColors,
      ...safeThemeColors,
      ...safeDefaultColors && safeDefaultPaletteEnabled ? safeDefaultColors : EMPTY_COLORS
    ],
    [
      safeCustomColors,
      safeThemeColors,
      safeDefaultColors,
      safeDefaultPaletteEnabled
    ]
  );
  const screenPath = !name ? "/colors/palette" : "/blocks/" + encodeURIComponent(name) + "/colors/palette";
  return /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
    /* @__PURE__ */ jsx(Subtitle, { level: 3, children: __("Palette") }),
    /* @__PURE__ */ jsx(ItemGroup, { isBordered: true, isSeparated: true, children: /* @__PURE__ */ jsx(NavigationButtonAsItem, { path: screenPath, children: /* @__PURE__ */ jsxs(HStack, { direction: "row", children: [
      colors.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(ZStack, { isLayered: false, offset: -8, children: colors.slice(0, 5).map(({ color }, index) => /* @__PURE__ */ jsx(
          ColorIndicatorWrapper,
          {
            children: /* @__PURE__ */ jsx(
              ColorIndicator,
              {
                colorValue: color
              }
            )
          },
          `${color}-${index}`
        )) }),
        /* @__PURE__ */ jsx(FlexItem, { isBlock: true, children: __("Edit palette") })
      ] }) : /* @__PURE__ */ jsx(FlexItem, { children: __("Add colors") }),
      /* @__PURE__ */ jsx(Icon, { icon: isRTL() ? chevronLeft : chevronRight })
    ] }) }) })
  ] });
}
var palette_default = Palette;
export {
  palette_default as default
};
//# sourceMappingURL=palette.mjs.map
