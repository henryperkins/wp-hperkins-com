// packages/block-editor/src/components/block-lock/use-block-lock.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
function useBlockLock(clientId) {
  return useSelect(
    (select) => {
      const {
        canLockBlockType,
        getBlockName,
        isEditLockedBlock,
        isMoveLockedBlock,
        isRemoveLockedBlock,
        isLockedBlock
      } = unlock(select(blockEditorStore));
      return {
        isEditLocked: isEditLockedBlock(clientId),
        isMoveLocked: isMoveLockedBlock(clientId),
        isRemoveLocked: isRemoveLockedBlock(clientId),
        canLock: canLockBlockType(getBlockName(clientId)),
        isLocked: isLockedBlock(clientId)
      };
    },
    [clientId]
  );
}
export {
  useBlockLock as default
};
//# sourceMappingURL=use-block-lock.mjs.map
