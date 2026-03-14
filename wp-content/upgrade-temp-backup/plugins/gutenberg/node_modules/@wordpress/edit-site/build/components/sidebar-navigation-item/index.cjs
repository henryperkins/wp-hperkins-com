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

// packages/edit-site/src/components/sidebar-navigation-item/index.js
var sidebar_navigation_item_exports = {};
__export(sidebar_navigation_item_exports, {
  default: () => SidebarNavigationItem
});
module.exports = __toCommonJS(sidebar_navigation_item_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_router = require("@wordpress/router");
var import_element = require("@wordpress/element");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_sidebar = require("../sidebar/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useHistory, useLink } = (0, import_lock_unlock.unlock)(import_router.privateApis);
function SidebarNavigationItem({
  className,
  icon,
  withChevron = false,
  suffix,
  uid,
  to,
  onClick,
  children,
  ...props
}) {
  const history = useHistory();
  const { navigate } = (0, import_element.useContext)(import_sidebar.SidebarNavigationContext);
  function handleClick(e) {
    if (onClick) {
      onClick(e);
      navigate("forward");
    } else if (to) {
      e.preventDefault();
      history.navigate(to);
      navigate("forward", `[id="${uid}"]`);
    }
  }
  const linkProps = useLink(to);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalItem,
    {
      className: (0, import_clsx.default)(
        "edit-site-sidebar-navigation-item",
        { "with-suffix": !withChevron && suffix },
        className
      ),
      id: uid,
      onClick: handleClick,
      href: to ? linkProps.href : void 0,
      ...props,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "flex-start", children: [
        icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_icons.Icon,
          {
            style: { fill: "currentcolor" },
            icon,
            size: 24
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexBlock, { children }),
        withChevron && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_icons.Icon,
          {
            icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeftSmall : import_icons.chevronRightSmall,
            className: "edit-site-sidebar-navigation-item__drilldown-indicator",
            size: 24
          }
        ),
        !withChevron && suffix
      ] })
    }
  );
}
//# sourceMappingURL=index.cjs.map
