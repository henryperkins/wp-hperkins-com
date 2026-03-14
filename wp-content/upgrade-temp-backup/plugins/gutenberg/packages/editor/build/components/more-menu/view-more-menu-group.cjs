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

// packages/editor/src/components/more-menu/view-more-menu-group.js
var view_more_menu_group_exports = {};
__export(view_more_menu_group_exports, {
  default: () => view_more_menu_group_default
});
module.exports = __toCommonJS(view_more_menu_group_exports);
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
var { Fill: ViewMoreMenuGroup, Slot } = (0, import_components.createSlotFill)(
  import_element.Platform.OS === "web" ? /* @__PURE__ */ Symbol("ViewMoreMenuGroup") : "ViewMoreMenuGroup"
);
ViewMoreMenuGroup.Slot = ({ fillProps }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slot, { fillProps });
var view_more_menu_group_default = ViewMoreMenuGroup;
//# sourceMappingURL=view-more-menu-group.cjs.map
