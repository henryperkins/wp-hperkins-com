"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/components/src/avatar/component.tsx
var component_exports = {};
__export(component_exports, {
  default: () => component_default
});
module.exports = __toCommonJS(component_exports);
var import_clsx = __toESM(require("clsx"));
var import_icon = __toESM(require("../icon/index.cjs"));
var import_tooltip = __toESM(require("../tooltip/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
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
  const avatar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: (0, import_clsx.default)("components-avatar", className, {
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
    children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
      className: "components-avatar__image",
      children: [!src && initials, !!status && !!statusIndicator && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
        className: "components-avatar__status-indicator",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icon.default, {
          icon: statusIndicator
        })
      })]
    }), showBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
      className: "components-avatar__name",
      children: label || name
    })]
  });
  if (name && (!showBadge || label)) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_tooltip.default, {
      text: name,
      children: avatar
    });
  }
  return avatar;
}
var component_default = Avatar;
//# sourceMappingURL=component.cjs.map
