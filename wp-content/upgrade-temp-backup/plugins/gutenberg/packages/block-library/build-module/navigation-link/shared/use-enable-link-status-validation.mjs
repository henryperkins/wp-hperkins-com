// packages/block-library/src/navigation-link/shared/use-enable-link-status-validation.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
function useEnableLinkStatusValidation(clientId) {
  return useSelect(
    (select) => {
      const {
        getSelectedBlockClientId,
        hasSelectedInnerBlock,
        getBlockParentsByBlockName
      } = select(blockEditorStore);
      const selectedBlockId = getSelectedBlockClientId();
      const rootNavigationId = getBlockParentsByBlockName(
        clientId,
        "core/navigation"
      )[0];
      return selectedBlockId === rootNavigationId || hasSelectedInnerBlock(rootNavigationId, true);
    },
    [clientId]
  );
}
export {
  useEnableLinkStatusValidation
};
//# sourceMappingURL=use-enable-link-status-validation.mjs.map
