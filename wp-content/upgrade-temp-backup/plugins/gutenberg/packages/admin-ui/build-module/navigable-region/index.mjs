// packages/admin-ui/src/navigable-region/index.tsx
import clsx from "clsx";
import { forwardRef } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
var NavigableRegion = forwardRef(
  ({ children, className, ariaLabel, as: Tag = "div", ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      Tag,
      {
        ref,
        className: clsx("admin-ui-navigable-region", className),
        "aria-label": ariaLabel,
        role: "region",
        tabIndex: "-1",
        ...props,
        children
      }
    );
  }
);
NavigableRegion.displayName = "NavigableRegion";
var navigable_region_default = NavigableRegion;
export {
  navigable_region_default as default
};
//# sourceMappingURL=index.mjs.map
