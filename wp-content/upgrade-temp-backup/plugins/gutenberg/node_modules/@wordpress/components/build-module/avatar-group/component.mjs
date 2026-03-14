// packages/components/src/avatar-group/component.tsx
import clsx from "clsx";
import { Children } from "@wordpress/element";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function AvatarGroup({
  className,
  max = 3,
  children,
  ...props
}) {
  const childArray = Children.toArray(children);
  const visible = childArray.slice(0, max);
  const overflowCount = childArray.length - max;
  return /* @__PURE__ */ _jsxs("div", {
    role: "group",
    className: clsx("components-avatar-group", className),
    ...props,
    children: [visible, overflowCount > 0 && /* @__PURE__ */ _jsx("span", {
      className: "components-avatar-group__overflow",
      "aria-label": `${overflowCount} more`,
      children: `+${overflowCount}`
    })]
  });
}
var component_default = AvatarGroup;
export {
  component_default as default
};
//# sourceMappingURL=component.mjs.map
