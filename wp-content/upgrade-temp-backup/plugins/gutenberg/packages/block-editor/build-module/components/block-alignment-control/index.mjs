// packages/block-editor/src/components/block-alignment-control/index.js
import BlockAlignmentUI from "./ui.mjs";
import { jsx } from "react/jsx-runtime";
var BlockAlignmentControl = (props) => {
  return /* @__PURE__ */ jsx(BlockAlignmentUI, { ...props, isToolbar: false });
};
var BlockAlignmentToolbar = (props) => {
  return /* @__PURE__ */ jsx(BlockAlignmentUI, { ...props, isToolbar: true });
};
export {
  BlockAlignmentControl,
  BlockAlignmentToolbar
};
//# sourceMappingURL=index.mjs.map
