// packages/block-editor/src/components/writing-flow/use-select-all.js
import { isEntirelySelected } from "@wordpress/dom";
import { useSelect, useDispatch } from "@wordpress/data";
import { __unstableUseShortcutEventMatch as useShortcutEventMatch } from "@wordpress/keyboard-shortcuts";
import { useRefEffect } from "@wordpress/compose";
import { store as blockEditorStore } from "../../store/index.mjs";
import { isInsideRootBlock, getBlockClientId } from "../../utils/dom.mjs";
function useSelectAll() {
  const { getBlockOrder, getSelectedBlockClientIds, getBlockRootClientId } = useSelect(blockEditorStore);
  const { multiSelect, selectBlock } = useDispatch(blockEditorStore);
  const isMatch = useShortcutEventMatch();
  return useRefEffect((node) => {
    function onKeyDown(event) {
      if (!isMatch("core/block-editor/select-all", event)) {
        return;
      }
      const selectedClientIds = getSelectedBlockClientIds();
      if (selectedClientIds.length < 2 && !isEntirelySelected(event.target)) {
        return;
      }
      event.preventDefault();
      const { ownerDocument } = event.target;
      const [firstSelectedClientId] = selectedClientIds;
      const activeClientId = getBlockClientId(
        ownerDocument.activeElement
      );
      if (activeClientId && activeClientId !== firstSelectedClientId && !isInsideRootBlock(
        ownerDocument.getElementById(
          "block-" + firstSelectedClientId
        ),
        ownerDocument.activeElement
      )) {
        selectBlock(activeClientId);
        return;
      }
      const rootClientId = getBlockRootClientId(firstSelectedClientId);
      const blockClientIds = getBlockOrder(rootClientId);
      if (selectedClientIds.length === blockClientIds.length) {
        if (rootClientId) {
          node.ownerDocument.defaultView.getSelection().removeAllRanges();
          selectBlock(rootClientId);
        }
        return;
      }
      multiSelect(
        blockClientIds[0],
        blockClientIds[blockClientIds.length - 1]
      );
    }
    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
export {
  useSelectAll as default
};
//# sourceMappingURL=use-select-all.mjs.map
