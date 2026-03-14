"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-styles/menu-items.js
var menu_items_exports = {};
__export(menu_items_exports, {
  default: () => BlockStylesMenuItems
});
module.exports = __toCommonJS(menu_items_exports);
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
function BlockStylesMenuItems({
  stylesToRender,
  activeStyle,
  onSelect = noop,
  onHoverStyle = noop
}) {
  if (!stylesToRender || stylesToRender.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: stylesToRender.map((style) => {
    const menuItemText = style.label || style.name;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.MenuItem,
      {
        icon: activeStyle.name === style.name ? import_icons.check : null,
        onClick: () => onSelect(style),
        onFocus: () => onHoverStyle(style),
        onBlur: () => onHoverStyle(null),
        onMouseEnter: () => onHoverStyle(style),
        onMouseLeave: () => onHoverStyle(null),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalText,
          {
            as: "span",
            limit: 18,
            ellipsizeMode: "tail",
            truncate: true,
            children: menuItemText
          }
        )
      },
      style.name
    );
  }) });
}
//# sourceMappingURL=menu-items.cjs.map
