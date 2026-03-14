// packages/block-editor/src/components/block-controls/groups.js
import { createSlotFill } from "@wordpress/components";
var BlockControlsDefault = createSlotFill("BlockControls");
var BlockControlsBlock = createSlotFill("BlockControlsBlock");
var BlockControlsInline = createSlotFill("BlockFormatControls");
var BlockControlsOther = createSlotFill("BlockControlsOther");
var BlockControlsParent = createSlotFill("BlockControlsParent");
var groups = {
  default: BlockControlsDefault,
  block: BlockControlsBlock,
  inline: BlockControlsInline,
  other: BlockControlsOther,
  parent: BlockControlsParent
};
var groups_default = groups;
export {
  groups_default as default
};
//# sourceMappingURL=groups.mjs.map
