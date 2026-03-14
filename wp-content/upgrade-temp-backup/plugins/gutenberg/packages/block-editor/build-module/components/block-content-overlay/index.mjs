// packages/block-editor/src/components/block-content-overlay/index.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
function useBlockOverlayActive(clientId) {
  return useSelect(
    (select) => {
      const { __unstableHasActiveBlockOverlayActive } = select(blockEditorStore);
      return __unstableHasActiveBlockOverlayActive(clientId);
    },
    [clientId]
  );
}
export {
  useBlockOverlayActive as default
};
//# sourceMappingURL=index.mjs.map
