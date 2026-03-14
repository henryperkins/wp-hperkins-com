// packages/block-editor/src/components/inspector-controls/groups.js
import { createSlotFill } from "@wordpress/components";
var InspectorControlsDefault = createSlotFill("InspectorControls");
var InspectorControlsAdvanced = createSlotFill("InspectorAdvancedControls");
var InspectorControlsBindings = createSlotFill("InspectorControlsBindings");
var InspectorControlsBackground = createSlotFill(
  "InspectorControlsBackground"
);
var InspectorControlsBorder = createSlotFill("InspectorControlsBorder");
var InspectorControlsColor = createSlotFill("InspectorControlsColor");
var InspectorControlsFilter = createSlotFill("InspectorControlsFilter");
var InspectorControlsDimensions = createSlotFill(
  "InspectorControlsDimensions"
);
var InspectorControlsPosition = createSlotFill("InspectorControlsPosition");
var InspectorControlsTypography = createSlotFill(
  "InspectorControlsTypography"
);
var InspectorControlsListView = createSlotFill("InspectorControlsListView");
var InspectorControlsStyles = createSlotFill("InspectorControlsStyles");
var InspectorControlsEffects = createSlotFill("InspectorControlsEffects");
var InspectorControlsContent = createSlotFill("InspectorControlsContent");
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
var PrivateInspectorControlsAllowedBlocks = createSlotFill(
  /* @__PURE__ */ Symbol("PrivateInspectorControlsAllowedBlocks")
);
export {
  PrivateInspectorControlsAllowedBlocks,
  groups_default as default
};
//# sourceMappingURL=groups.mjs.map
