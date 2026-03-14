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

// packages/customize-widgets/src/components/customize-widgets/use-clear-selected-block.js
var use_clear_selected_block_exports = {};
__export(use_clear_selected_block_exports, {
  default: () => useClearSelectedBlock
});
module.exports = __toCommonJS(use_clear_selected_block_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
function useClearSelectedBlock(sidebarControl, popoverRef) {
  const { hasSelectedBlock, hasMultiSelection } = (0, import_data.useSelect)(import_block_editor.store);
  const { clearSelectedBlock } = (0, import_data.useDispatch)(import_block_editor.store);
  (0, import_element.useEffect)(() => {
    if (popoverRef.current && sidebarControl) {
      let handleClearSelectedBlock = function(element) {
        if (
          // 1. Make sure there are blocks being selected.
          (hasSelectedBlock() || hasMultiSelection()) && // 2. The element should exist in the DOM (not deleted).
          element && ownerDocument.contains(element) && // 3. It should also not exist in the container, the popover, nor the dialog.
          !container.contains(element) && !popoverRef.current.contains(element) && !element.closest('[role="dialog"]') && // 4. The inspector should not be opened.
          !inspector.expanded()
        ) {
          clearSelectedBlock();
        }
      }, handleMouseDown = function(event) {
        handleClearSelectedBlock(event.target);
      }, handleBlur = function() {
        handleClearSelectedBlock(ownerDocument.activeElement);
      };
      const inspector = sidebarControl.inspector;
      const container = sidebarControl.container[0];
      const ownerDocument = container.ownerDocument;
      const ownerWindow = ownerDocument.defaultView;
      ownerDocument.addEventListener("mousedown", handleMouseDown);
      ownerWindow.addEventListener("blur", handleBlur);
      return () => {
        ownerDocument.removeEventListener(
          "mousedown",
          handleMouseDown
        );
        ownerWindow.removeEventListener("blur", handleBlur);
      };
    }
  }, [
    popoverRef,
    sidebarControl,
    hasSelectedBlock,
    hasMultiSelection,
    clearSelectedBlock
  ]);
}
//# sourceMappingURL=use-clear-selected-block.cjs.map
