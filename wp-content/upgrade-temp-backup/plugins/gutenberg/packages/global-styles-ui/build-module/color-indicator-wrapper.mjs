// packages/global-styles-ui/src/color-indicator-wrapper.tsx
import clsx from "clsx";
import { Flex } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function ColorIndicatorWrapper({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Flex,
    {
      className: clsx(
        "global-styles-ui__color-indicator-wrapper",
        className
      ),
      ...props,
      children
    }
  );
}
var color_indicator_wrapper_default = ColorIndicatorWrapper;
export {
  color_indicator_wrapper_default as default
};
//# sourceMappingURL=color-indicator-wrapper.mjs.map
