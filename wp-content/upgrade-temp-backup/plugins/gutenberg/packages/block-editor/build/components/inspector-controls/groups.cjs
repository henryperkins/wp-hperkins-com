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

// packages/block-editor/src/components/inspector-controls/groups.js
var groups_exports = {};
__export(groups_exports, {
  PrivateInspectorControlsAllowedBlocks: () => PrivateInspectorControlsAllowedBlocks,
  default: () => groups_default
});
module.exports = __toCommonJS(groups_exports);
var import_components = require("@wordpress/components");
var InspectorControlsDefault = (0, import_components.createSlotFill)("InspectorControls");
var InspectorControlsAdvanced = (0, import_components.createSlotFill)("InspectorAdvancedControls");
var InspectorControlsBindings = (0, import_components.createSlotFill)("InspectorControlsBindings");
var InspectorControlsBackground = (0, import_components.createSlotFill)(
  "InspectorControlsBackground"
);
var InspectorControlsBorder = (0, import_components.createSlotFill)("InspectorControlsBorder");
var InspectorControlsColor = (0, import_components.createSlotFill)("InspectorControlsColor");
var InspectorControlsFilter = (0, import_components.createSlotFill)("InspectorControlsFilter");
var InspectorControlsDimensions = (0, import_components.createSlotFill)(
  "InspectorControlsDimensions"
);
var InspectorControlsPosition = (0, import_components.createSlotFill)("InspectorControlsPosition");
var InspectorControlsTypography = (0, import_components.createSlotFill)(
  "InspectorControlsTypography"
);
var InspectorControlsListView = (0, import_components.createSlotFill)("InspectorControlsListView");
var InspectorControlsStyles = (0, import_components.createSlotFill)("InspectorControlsStyles");
var InspectorControlsEffects = (0, import_components.createSlotFill)("InspectorControlsEffects");
var InspectorControlsContent = (0, import_components.createSlotFill)("InspectorControlsContent");
var groups = {
  default: InspectorControlsDefault,
  advanced: InspectorControlsAdvanced,
  background: InspectorControlsBackground,
  bindings: InspectorControlsBindings,
  border: InspectorControlsBorder,
  color: InspectorControlsColor,
  content: InspectorControlsContent,
  dimensions: InspectorControlsDimensions,
  effects: InspectorControlsEffects,
  filter: InspectorControlsFilter,
  list: InspectorControlsListView,
  position: InspectorControlsPosition,
  settings: InspectorControlsDefault,
  // Alias for default.
  styles: InspectorControlsStyles,
  typography: InspectorControlsTypography
};
var groups_default = groups;
var PrivateInspectorControlsAllowedBlocks = (0, import_components.createSlotFill)(
  /* @__PURE__ */ Symbol("PrivateInspectorControlsAllowedBlocks")
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrivateInspectorControlsAllowedBlocks
});
//# sourceMappingURL=groups.cjs.map
