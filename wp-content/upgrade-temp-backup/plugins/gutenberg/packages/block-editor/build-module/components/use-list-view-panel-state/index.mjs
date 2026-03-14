// packages/block-editor/src/components/use-list-view-panel-state/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
function useListViewPanelState(clientId) {
  const { isOpened, expandRevision } = useSelect(
    (select) => {
      const { isListViewPanelOpened, getListViewExpandRevision } = unlock(
        select(blockEditorStore)
      );
      return {
        isOpened: isListViewPanelOpened(clientId),
        expandRevision: getListViewExpandRevision()
      };
    },
    [clientId]
  );
  const { __unstableToggleListViewPanel: toggleListViewPanel } = useDispatch(blockEditorStore);
  const handleToggle = (opened) => {
    toggleListViewPanel(clientId, opened);
  };
  return {
    isOpened,
    expandRevision,
    handleToggle
  };
}
export {
  useListViewPanelState as default
};
//# sourceMappingURL=index.mjs.map
