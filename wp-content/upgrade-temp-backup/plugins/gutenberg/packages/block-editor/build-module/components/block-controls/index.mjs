// packages/block-editor/src/components/block-controls/index.js
import BlockControlsFill from "./fill.mjs";
import BlockControlsSlot from "./slot.mjs";
import { jsx } from "react/jsx-runtime";
var BlockControls = BlockControlsFill;
BlockControls.Slot = BlockControlsSlot;
var BlockFormatControls = (props) => {
  return /* @__PURE__ */ jsx(BlockControlsFill, { group: "inline", ...props });
};
BlockFormatControls.Slot = function Slot(props) {
  return /* @__PURE__ */ jsx(BlockControlsSlot, { group: "inline", ...props });
};
var block_controls_default = BlockControls;
export {
  BlockFormatControls,
  block_controls_default as default
};
//# sourceMappingURL=index.mjs.map
