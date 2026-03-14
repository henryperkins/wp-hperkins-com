"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-edit/context.js
var context_exports = {};
__export(context_exports, {
  BlockEditContextProvider: () => Provider,
  DEFAULT_BLOCK_EDIT_CONTEXT: () => DEFAULT_BLOCK_EDIT_CONTEXT,
  blockBindingsKey: () => blockBindingsKey,
  blockEditingModeKey: () => blockEditingModeKey,
  isInListViewBlockSupportTreeKey: () => isInListViewBlockSupportTreeKey,
  isPreviewModeKey: () => isPreviewModeKey,
  mayDisplayControlsKey: () => mayDisplayControlsKey,
  mayDisplayParentControlsKey: () => mayDisplayParentControlsKey,
  mayDisplayPatternEditingControlsKey: () => mayDisplayPatternEditingControlsKey,
  useBlockEditContext: () => useBlockEditContext
});
module.exports = __toCommonJS(context_exports);
var import_element = require("@wordpress/element");
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
var Context = (0, import_element.createContext)(DEFAULT_BLOCK_EDIT_CONTEXT);
Context.displayName = "BlockEditContext";
var { Provider } = Context;
function useBlockEditContext() {
  return (0, import_element.useContext)(Context);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockEditContextProvider,
  DEFAULT_BLOCK_EDIT_CONTEXT,
  blockBindingsKey,
  blockEditingModeKey,
  isInListViewBlockSupportTreeKey,
  isPreviewModeKey,
  mayDisplayControlsKey,
  mayDisplayParentControlsKey,
  mayDisplayPatternEditingControlsKey,
  useBlockEditContext
});
//# sourceMappingURL=context.cjs.map
