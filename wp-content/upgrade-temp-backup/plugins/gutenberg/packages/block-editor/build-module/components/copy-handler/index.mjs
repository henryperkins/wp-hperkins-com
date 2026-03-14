// packages/block-editor/src/components/copy-handler/index.js
import deprecated from "@wordpress/deprecated";
import useClipboardHandler from "../writing-flow/use-clipboard-handler.mjs";
import { jsx } from "react/jsx-runtime";
var __unstableUseClipboardHandler = () => {
  deprecated("__unstableUseClipboardHandler", {
    alternative: "BlockCanvas or WritingFlow",
    since: "6.4",
    version: "6.7"
  });
  return useClipboardHandler();
};
function CopyHandler(props) {
  deprecated("CopyHandler", {
    alternative: "BlockCanvas or WritingFlow",
    since: "6.4",
    version: "6.7"
  });
  return /* @__PURE__ */ jsx("div", { ...props, ref: useClipboardHandler() });
}
export {
  __unstableUseClipboardHandler,
  CopyHandler as default
};
//# sourceMappingURL=index.mjs.map
