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

// packages/editor/src/components/more-menu/tools-more-menu-group.js
var tools_more_menu_group_exports = {};
__export(tools_more_menu_group_exports, {
  default: () => tools_more_menu_group_default
});
module.exports = __toCommonJS(tools_more_menu_group_exports);
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill: ToolsMoreMenuGroup, Slot } = (0, import_components.createSlotFill)("ToolsMoreMenuGroup");
ToolsMoreMenuGroup.Slot = ({ fillProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, { fillProps });
var tools_more_menu_group_default = ToolsMoreMenuGroup;
//# sourceMappingURL=tools-more-menu-group.cjs.map
