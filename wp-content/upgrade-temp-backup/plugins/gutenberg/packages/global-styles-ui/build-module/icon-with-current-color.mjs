// packages/global-styles-ui/src/icon-with-current-color.tsx
import clsx from "clsx";
import { Icon } from "@wordpress/icons";
import { jsx } from "react/jsx-runtime";
function IconWithCurrentColor({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Icon,
    {
      className: clsx(
        className,
        "global-styles-ui-icon-with-current-color"
      ),
      ...props
    }
  );
}
export {
  IconWithCurrentColor
};
//# sourceMappingURL=icon-with-current-color.mjs.map
