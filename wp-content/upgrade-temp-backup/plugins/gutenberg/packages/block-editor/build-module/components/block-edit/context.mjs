// packages/block-editor/src/components/block-edit/context.js
import { createContext, useContext } from "@wordpress/element";
var mayDisplayControlsKey = /* @__PURE__ */ Symbol("mayDisplayControls");
var mayDisplayParentControlsKey = /* @__PURE__ */ Symbol("mayDisplayParentControls");
var mayDisplayPatternEditingControlsKey = /* @__PURE__ */ Symbol(
  "mayDisplayPatternEditingControls"
);
var blockEditingModeKey = /* @__PURE__ */ Symbol("blockEditingMode");
var blockBindingsKey = /* @__PURE__ */ Symbol("blockBindings");
var isPreviewModeKey = /* @__PURE__ */ Symbol("isPreviewMode");
var isInListViewBlockSupportTreeKey = /* @__PURE__ */ Symbol(
  "isInListViewBlockSupportTree"
);
var DEFAULT_BLOCK_EDIT_CONTEXT = {
  name: "",
  isSelected: false
};
var Context = createContext(DEFAULT_BLOCK_EDIT_CONTEXT);
Context.displayName = "BlockEditContext";
var { Provider } = Context;
function useBlockEditContext() {
  return useContext(Context);
}
export {
  Provider as BlockEditContextProvider,
  DEFAULT_BLOCK_EDIT_CONTEXT,
  blockBindingsKey,
  blockEditingModeKey,
  isInListViewBlockSupportTreeKey,
  isPreviewModeKey,
  mayDisplayControlsKey,
  mayDisplayParentControlsKey,
  mayDisplayPatternEditingControlsKey,
  useBlockEditContext
};
//# sourceMappingURL=context.mjs.map
