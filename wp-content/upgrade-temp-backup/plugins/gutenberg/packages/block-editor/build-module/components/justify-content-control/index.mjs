// packages/block-editor/src/components/justify-content-control/index.js
import JustifyContentUI from "./ui.mjs";
import { jsx } from "react/jsx-runtime";
var JustifyContentControl = (props) => {
  return /* @__PURE__ */ jsx(JustifyContentUI, { ...props, isToolbar: false });
};
var JustifyToolbar = (props) => {
  return /* @__PURE__ */ jsx(JustifyContentUI, { ...props, isToolbar: true });
};
export {
  JustifyContentControl,
  JustifyToolbar
};
//# sourceMappingURL=index.mjs.map
