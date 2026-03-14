// packages/block-editor/src/components/list-view/use-list-view-client-ids.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
function useListViewClientIds({ blocks, rootClientId }) {
  return useSelect(
    (select) => {
      const {
        getDraggedBlockClientIds,
        getSelectedBlockClientIds,
        getEnabledClientIdsTree
      } = unlock(select(blockEditorStore));
      return {
        selectedClientIds: getSelectedBlockClientIds(),
        draggedClientIds: getDraggedBlockClientIds(),
        clientIdsTree: blocks ?? getEnabledClientIdsTree(rootClientId)
      };
    },
    [blocks, rootClientId]
  );
}
export {
  useListViewClientIds as default
};
//# sourceMappingURL=use-list-view-client-ids.mjs.map
