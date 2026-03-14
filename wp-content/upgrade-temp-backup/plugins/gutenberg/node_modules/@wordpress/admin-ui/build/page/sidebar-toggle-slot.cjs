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

// packages/admin-ui/src/page/sidebar-toggle-slot.tsx
var sidebar_toggle_slot_exports = {};
__export(sidebar_toggle_slot_exports, {
  SidebarToggleFill: () => SidebarToggleFill,
  SidebarToggleSlot: () => SidebarToggleSlot
});
module.exports = __toCommonJS(sidebar_toggle_slot_exports);
var import_components = require("@wordpress/components");
var { Fill: SidebarToggleFill, Slot: SidebarToggleSlot } = (0, import_components.createSlotFill)("SidebarToggle");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SidebarToggleFill,
  SidebarToggleSlot
});
//# sourceMappingURL=sidebar-toggle-slot.cjs.map
