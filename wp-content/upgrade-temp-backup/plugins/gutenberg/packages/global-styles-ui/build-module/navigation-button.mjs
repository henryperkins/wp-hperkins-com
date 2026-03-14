// packages/global-styles-ui/src/navigation-button.tsx
import {
  Navigator,
  __experimentalItem as Item,
  FlexItem,
  __experimentalHStack as HStack
} from "@wordpress/components";
import { IconWithCurrentColor } from "./icon-with-current-color.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function GenericNavigationButton({
  icon,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(Item, { ...props, children: [
    icon && /* @__PURE__ */ jsxs(HStack, { justify: "flex-start", children: [
      /* @__PURE__ */ jsx(IconWithCurrentColor, { icon, size: 24 }),
      /* @__PURE__ */ jsx(FlexItem, { children })
    ] }),
    !icon && children
  ] });
}
function NavigationButtonAsItem(props) {
  return /* @__PURE__ */ jsx(Navigator.Button, { as: GenericNavigationButton, ...props });
}
function NavigationBackButtonAsItem(props) {
  return /* @__PURE__ */ jsx(Navigator.BackButton, { as: GenericNavigationButton, ...props });
}
export {
  NavigationBackButtonAsItem,
  NavigationButtonAsItem
};
//# sourceMappingURL=navigation-button.mjs.map
