// packages/customize-widgets/src/components/customize-widgets/use-clear-selected-block.js
import { useEffect } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
function useClearSelectedBlock(sidebarControl, popoverRef) {
  const { hasSelectedBlock, hasMultiSelection } = useSelect(blockEditorStore);
  const { clearSelectedBlock } = useDispatch(blockEditorStore);
  useEffect(() => {
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
export {
  useClearSelectedBlock as default
};
//# sourceMappingURL=use-clear-selected-block.mjs.map
