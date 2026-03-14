// packages/global-styles-ui/src/font-library/font-card.tsx
import { _n, sprintf, isRTL } from "@wordpress/i18n";
import {
  useNavigator,
  __experimentalText as Text,
  Button,
  Flex,
  FlexItem
} from "@wordpress/components";
import { Icon, chevronLeft, chevronRight } from "@wordpress/icons";
import FontDemo from "./font-demo.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function FontCard({
  font,
  onClick,
  variantsText,
  navigatorPath
}) {
  const variantsCount = font.fontFace?.length || 1;
  const style = {
    cursor: !!onClick ? "pointer" : "default"
  };
  const navigator = useNavigator();
  return /* @__PURE__ */ jsx(
    Button,
    {
      __next40pxDefaultSize: true,
      onClick: () => {
        onClick();
        if (navigatorPath) {
          navigator.goTo(navigatorPath);
        }
      },
      style,
      className: "font-library__font-card",
      children: /* @__PURE__ */ jsxs(Flex, { justify: "space-between", wrap: false, children: [
        /* @__PURE__ */ jsx(FontDemo, { font }),
        /* @__PURE__ */ jsxs(Flex, { justify: "flex-end", children: [
          /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(Text, { className: "font-library__font-card__count", children: variantsText || sprintf(
            /* translators: %d: Number of font variants. */
            _n(
              "%d variant",
              "%d variants",
              variantsCount
            ),
            variantsCount
          ) }) }),
          /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(Icon, { icon: isRTL() ? chevronLeft : chevronRight }) })
        ] })
      ] })
    }
  );
}
var font_card_default = FontCard;
export {
  font_card_default as default
};
//# sourceMappingURL=font-card.mjs.map
