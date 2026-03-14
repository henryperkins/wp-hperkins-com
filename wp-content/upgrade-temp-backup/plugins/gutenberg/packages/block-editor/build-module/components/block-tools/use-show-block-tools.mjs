// packages/block-editor/src/components/block-tools/use-show-block-tools.js
import { useSelect } from "@wordpress/data";
import { isUnmodifiedDefaultBlock } from "@wordpress/blocks";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
function useShowBlockTools() {
  return useSelect((select) => {
    const {
      getSelectedBlockClientId,
      getFirstMultiSelectedBlockClientId,
      getBlock,
      getBlockMode,
      getSettings,
      isTyping,
      isBlockInterfaceHidden
    } = unlock(select(blockEditorStore));
    const clientId = getSelectedBlockClientId() || getFirstMultiSelectedBlockClientId();
    const block = getBlock(clientId);
    const hasSelectedBlock = !!clientId && !!block;
    const isEmptyDefaultBlock = hasSelectedBlock && isUnmodifiedDefaultBlock(block, "content") && getBlockMode(clientId) !== "html";
    const _showEmptyBlockSideInserter = clientId && !isTyping() && isEmptyDefaultBlock;
    const _showBlockToolbarPopover = !isBlockInterfaceHidden() && !getSettings().hasFixedToolbar && !_showEmptyBlockSideInserter && hasSelectedBlock && !isEmptyDefaultBlock;
    return {
      showEmptyBlockSideInserter: _showEmptyBlockSideInserter,
      showBlockToolbarPopover: _showBlockToolbarPopover
    };
  }, []);
}
export {
  useShowBlockTools
};
//# sourceMappingURL=use-show-block-tools.mjs.map
