// packages/block-editor/src/components/block-vertical-alignment-control/index.js
import BlockVerticalAlignmentUI from "./ui.mjs";
import { jsx } from "react/jsx-runtime";
var BlockVerticalAlignmentControl = (props) => {
  return /* @__PURE__ */ jsx(BlockVerticalAlignmentUI, { ...props, isToolbar: false });
};
var BlockVerticalAlignmentToolbar = (props) => {
  return /* @__PURE__ */ jsx(BlockVerticalAlignmentUI, { ...props, isToolbar: true });
};
export {
  BlockVerticalAlignmentControl,
  BlockVerticalAlignmentToolbar
};
//# sourceMappingURL=index.mjs.map
