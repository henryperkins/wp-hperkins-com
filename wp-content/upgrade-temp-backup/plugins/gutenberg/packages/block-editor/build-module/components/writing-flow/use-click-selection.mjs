// packages/block-editor/src/components/writing-flow/use-click-selection.js
import { useSelect, useDispatch } from "@wordpress/data";
import { useRefEffect } from "@wordpress/compose";
import { store as blockEditorStore } from "../../store/index.mjs";
import { getBlockClientId } from "../../utils/dom.mjs";
function useClickSelection() {
  const { selectBlock } = useDispatch(blockEditorStore);
  const { isSelectionEnabled, getBlockSelectionStart, hasMultiSelection } = useSelect(blockEditorStore);
  return useRefEffect(
    (node) => {
      function onMouseDown(event) {
        if (!isSelectionEnabled() || event.button !== 0) {
          return;
        }
        const startClientId = getBlockSelectionStart();
        const clickedClientId = getBlockClientId(event.target);
        if (event.shiftKey) {
          if (startClientId && startClientId !== clickedClientId) {
            node.contentEditable = true;
            node.focus();
          }
        } else if (hasMultiSelection()) {
          selectBlock(clickedClientId);
        }
      }
      node.addEventListener("mousedown", onMouseDown);
      return () => {
        node.removeEventListener("mousedown", onMouseDown);
      };
    },
    [
      selectBlock,
      isSelectionEnabled,
      getBlockSelectionStart,
      hasMultiSelection
    ]
  );
}
export {
  useClickSelection as default
};
//# sourceMappingURL=use-click-selection.mjs.map
