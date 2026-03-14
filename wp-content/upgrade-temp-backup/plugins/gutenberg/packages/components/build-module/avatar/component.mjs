// packages/components/src/avatar/component.tsx
import clsx from "clsx";
import Icon from "../icon/index.mjs";
import Tooltip from "../tooltip/index.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function Avatar({
  className,
  src,
  name,
  label,
  badge = false,
  size = "default",
  borderColor,
  status,
  statusIndicator,
  style,
  ...props
}) {
  const showBadge = badge && !!name;
  const initials = name ? name.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase() : void 0;
  const customProperties = {
    ...style,
    ...src ? {
      "--components-avatar-url": `url(${src})`
    } : {},
    ...borderColor ? {
      "--components-avatar-outline-color": borderColor
    } : {}
  };
  const avatar = /* @__PURE__ */ _jsxs("div", {
    className: clsx("components-avatar", className, {
      "has-avatar-border-color": !!borderColor,
      "has-src": !!src,
      "has-badge": showBadge,
      "is-small": size === "small",
      "has-status": !!status,
      [`is-${status}`]: !!status
    }),
    style: customProperties,
    role: "img",
    "aria-label": name,
    ...props,
    children: [/* @__PURE__ */ _jsxs("span", {
      className: "components-avatar__image",
      children: [!src && initials, !!status && !!statusIndicator && /* @__PURE__ */ _jsx("span", {
        className: "components-avatar__status-indicator",
        children: /* @__PURE__ */ _jsx(Icon, {
          icon: statusIndicator
        })
      })]
    }), showBadge && /* @__PURE__ */ _jsx("span", {
      className: "components-avatar__name",
      children: label || name
    })]
  });
  if (name && (!showBadge || label)) {
    return /* @__PURE__ */ _jsx(Tooltip, {
      text: name,
      children: avatar
    });
  }
  return avatar;
}
var component_default = Avatar;
export {
  component_default as default
};
//# sourceMappingURL=component.mjs.map
