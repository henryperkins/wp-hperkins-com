// packages/global-styles-ui/src/typography-elements.tsx
import { __ } from "@wordpress/i18n";
import {
  __experimentalItemGroup as ItemGroup,
  __experimentalVStack as VStack,
  __experimentalHStack as HStack,
  FlexItem
} from "@wordpress/components";
import { NavigationButtonAsItem } from "./navigation-button.mjs";
import { Subtitle } from "./subtitle.mjs";
import { useStyle } from "./hooks.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function ElementItem({ parentMenu, element, label }) {
  const prefix = element === "text" || !element ? "" : `elements.${element}.`;
  const extraStyles = element === "link" ? {
    textDecoration: "underline"
  } : {};
  const [fontFamily] = useStyle(
    prefix + "typography.fontFamily"
  );
  const [fontStyle] = useStyle(prefix + "typography.fontStyle");
  const [fontWeight] = useStyle(
    prefix + "typography.fontWeight"
  );
  const [backgroundColor] = useStyle(
    prefix + "color.background"
  );
  const [fallbackBackgroundColor] = useStyle("color.background");
  const [gradientValue] = useStyle(prefix + "color.gradient");
  const [color] = useStyle(prefix + "color.text");
  return /* @__PURE__ */ jsx(NavigationButtonAsItem, { path: parentMenu + "/typography/" + element, children: /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", children: [
    /* @__PURE__ */ jsx(
      FlexItem,
      {
        className: "global-styles-ui-screen-typography__indicator",
        "aria-hidden": "true",
        style: {
          fontFamily: fontFamily ?? "serif",
          background: gradientValue ?? backgroundColor ?? fallbackBackgroundColor,
          color,
          fontStyle,
          fontWeight,
          ...extraStyles
        },
        children: __("Aa")
      }
    ),
    /* @__PURE__ */ jsx(FlexItem, { children: label })
  ] }) });
}
function TypographyElements() {
  const parentMenu = "";
  return /* @__PURE__ */ jsxs(VStack, { spacing: 3, children: [
    /* @__PURE__ */ jsx(Subtitle, { level: 3, children: __("Elements") }),
    /* @__PURE__ */ jsxs(ItemGroup, { isBordered: true, isSeparated: true, children: [
      /* @__PURE__ */ jsx(
        ElementItem,
        {
          parentMenu,
          element: "text",
          label: __("Text")
        }
      ),
      /* @__PURE__ */ jsx(
        ElementItem,
        {
          parentMenu,
          element: "link",
          label: __("Links")
        }
      ),
      /* @__PURE__ */ jsx(
        ElementItem,
        {
          parentMenu,
          element: "heading",
          label: __("Headings")
        }
      ),
      /* @__PURE__ */ jsx(
        ElementItem,
        {
          parentMenu,
          element: "caption",
          label: __("Captions")
        }
      ),
      /* @__PURE__ */ jsx(
        ElementItem,
        {
          parentMenu,
          element: "button",
          label: __("Buttons")
        }
      )
    ] })
  ] });
}
var typography_elements_default = TypographyElements;
export {
  typography_elements_default as default
};
//# sourceMappingURL=typography-elements.mjs.map
