// packages/global-styles-ui/src/screen-root.tsx
import {
  __experimentalItemGroup as ItemGroup,
  __experimentalHStack as HStack,
  __experimentalSpacer as Spacer,
  __experimentalVStack as VStack,
  FlexItem,
  CardBody,
  Card,
  CardDivider,
  CardMedia
} from "@wordpress/components";
import { isRTL, __ } from "@wordpress/i18n";
import { chevronLeft, chevronRight } from "@wordpress/icons";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { IconWithCurrentColor } from "./icon-with-current-color.mjs";
import { NavigationButtonAsItem } from "./navigation-button.mjs";
import RootMenu from "./root-menu.mjs";
import PreviewStyles from "./preview-styles.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function ScreenRoot() {
  const hasVariations = useSelect((select) => {
    const { __experimentalGetCurrentThemeGlobalStylesVariations } = select(coreStore);
    return !!__experimentalGetCurrentThemeGlobalStylesVariations()?.length;
  }, []);
  return /* @__PURE__ */ jsxs(
    Card,
    {
      size: "small",
      isBorderless: true,
      className: "global-styles-ui-screen-root",
      isRounded: false,
      children: [
        /* @__PURE__ */ jsx(CardBody, { children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
          /* @__PURE__ */ jsx(Card, { className: "global-styles-ui-screen-root__active-style-tile", children: /* @__PURE__ */ jsx(CardMedia, { className: "global-styles-ui-screen-root__active-style-tile-preview", children: /* @__PURE__ */ jsx(PreviewStyles, {}) }) }),
          hasVariations && /* @__PURE__ */ jsx(ItemGroup, { children: /* @__PURE__ */ jsx(NavigationButtonAsItem, { path: "/variations", children: /* @__PURE__ */ jsxs(HStack, { justify: "space-between", children: [
            /* @__PURE__ */ jsx(FlexItem, { children: __("Browse styles") }),
            /* @__PURE__ */ jsx(
              IconWithCurrentColor,
              {
                icon: isRTL() ? chevronLeft : chevronRight
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsx(RootMenu, {})
        ] }) }),
        /* @__PURE__ */ jsx(CardDivider, {}),
        /* @__PURE__ */ jsxs(CardBody, { children: [
          /* @__PURE__ */ jsx(
            Spacer,
            {
              as: "p",
              paddingTop: 2,
              paddingX: "13px",
              marginBottom: 4,
              children: __(
                "Customize the appearance of specific blocks for the whole site."
              )
            }
          ),
          /* @__PURE__ */ jsx(ItemGroup, { children: /* @__PURE__ */ jsx(NavigationButtonAsItem, { path: "/blocks", children: /* @__PURE__ */ jsxs(HStack, { justify: "space-between", children: [
            /* @__PURE__ */ jsx(FlexItem, { children: __("Blocks") }),
            /* @__PURE__ */ jsx(
              IconWithCurrentColor,
              {
                icon: isRTL() ? chevronLeft : chevronRight
              }
            )
          ] }) }) })
        ] })
      ]
    }
  );
}
var screen_root_default = ScreenRoot;
export {
  screen_root_default as default
};
//# sourceMappingURL=screen-root.mjs.map
