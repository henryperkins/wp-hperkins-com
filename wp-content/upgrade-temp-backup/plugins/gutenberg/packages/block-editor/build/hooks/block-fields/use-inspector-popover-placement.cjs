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

// packages/block-editor/src/hooks/block-fields/use-inspector-popover-placement.js
var use_inspector_popover_placement_exports = {};
__export(use_inspector_popover_placement_exports, {
  useInspectorPopoverPlacement: () => useInspectorPopoverPlacement
});
module.exports = __toCommonJS(use_inspector_popover_placement_exports);
var import_compose = require("@wordpress/compose");
function useInspectorPopoverPlacement({ isControl } = { isControl: false }) {
  const isMobile = (0, import_compose.useViewportMatch)("medium", "<");
  return !isMobile ? {
    popoverProps: {
      placement: "left-start",
      // For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
      offset: isControl ? 35 : 259
    }
  } : {};
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useInspectorPopoverPlacement
});
//# sourceMappingURL=use-inspector-popover-placement.cjs.map
