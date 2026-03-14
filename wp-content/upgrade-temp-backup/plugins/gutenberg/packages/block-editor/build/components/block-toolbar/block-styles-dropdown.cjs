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

// packages/block-editor/src/components/block-toolbar/block-styles-dropdown.js
var block_styles_dropdown_exports = {};
__export(block_styles_dropdown_exports, {
  default: () => BlockStylesDropdown
});
module.exports = __toCommonJS(block_styles_dropdown_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_block_styles_menu = __toESM(require("../block-switcher/block-styles-menu.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function BlockStylesDropdown({
  clientIds,
  children,
  label,
  text
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarItem, { children: (toggleProps) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
    {
      className: "block-editor-block-switcher",
      label,
      popoverProps: {
        placement: "bottom-start",
        className: "block-editor-block-switcher__popover"
      },
      icon: children,
      text,
      toggleProps: {
        description: (0, import_i18n.__)("Change block style"),
        ...toggleProps
      },
      menuProps: { orientation: "both" },
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-block-switcher__container", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_block_styles_menu.default,
        {
          hoveredBlock: {
            clientId: clientIds[0]
          },
          onSwitch: onClose
        }
      ) })
    }
  ) }) });
}
//# sourceMappingURL=block-styles-dropdown.cjs.map
