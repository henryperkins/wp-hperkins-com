// packages/block-editor/src/components/tool-selector/index.js
import deprecated from "@wordpress/deprecated";
import { forwardRef } from "@wordpress/element";
function ToolSelector() {
  deprecated("wp.blockEditor.ToolSelector", {
    since: "6.9",
    hint: "The ToolSelector component no longer renders anything."
  });
  return null;
}
var tool_selector_default = forwardRef(ToolSelector);
export {
  tool_selector_default as default
};
//# sourceMappingURL=index.mjs.map
