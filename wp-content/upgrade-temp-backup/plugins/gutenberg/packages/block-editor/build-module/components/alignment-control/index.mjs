// packages/block-editor/src/components/alignment-control/index.js
import AlignmentUI from "./ui.mjs";
import { jsx } from "react/jsx-runtime";
var AlignmentControl = (props) => {
  return /* @__PURE__ */ jsx(AlignmentUI, { ...props, isToolbar: false });
};
var AlignmentToolbar = (props) => {
  return /* @__PURE__ */ jsx(AlignmentUI, { ...props, isToolbar: true });
};
export {
  AlignmentControl,
  AlignmentToolbar
};
//# sourceMappingURL=index.mjs.map
