// packages/global-styles-ui/src/font-sizes/font-sizes-count.tsx
import { __, isRTL } from "@wordpress/i18n";
import {
  __experimentalItemGroup as ItemGroup,
  __experimentalVStack as VStack,
  __experimentalHStack as HStack,
  FlexItem
} from "@wordpress/components";
import { Icon, chevronLeft, chevronRight } from "@wordpress/icons";
import { Subtitle } from "../subtitle.mjs";
import { NavigationButtonAsItem } from "../navigation-button.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function FontSizes() {
  return /* @__PURE__ */ jsxs(VStack, { spacing: 2, children: [
    /* @__PURE__ */ jsx(HStack, { justify: "space-between", children: /* @__PURE__ */ jsx(Subtitle, { level: 3, children: __("Font Sizes") }) }),
    /* @__PURE__ */ jsx(ItemGroup, { isBordered: true, isSeparated: true, children: /* @__PURE__ */ jsx(NavigationButtonAsItem, { path: "/typography/font-sizes", children: /* @__PURE__ */ jsxs(HStack, { direction: "row", children: [
      /* @__PURE__ */ jsx(FlexItem, { children: __("Font size presets") }),
      /* @__PURE__ */ jsx(Icon, { icon: isRTL() ? chevronLeft : chevronRight })
    ] }) }) })
  ] });
}
var font_sizes_count_default = FontSizes;
export {
  font_sizes_count_default as default
};
//# sourceMappingURL=font-sizes-count.mjs.map
