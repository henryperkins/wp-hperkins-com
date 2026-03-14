// packages/editor/src/components/global-styles/block-link.js
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { usePrevious } from "@wordpress/compose";
function GlobalStylesBlockLink({ path, onPathChange }) {
  const { selectedBlockName, selectedBlockClientId } = useSelect(
    (select) => {
      const { getSelectedBlockClientId, getBlockName } = select(blockEditorStore);
      const clientId = getSelectedBlockClientId();
      return {
        selectedBlockName: getBlockName(clientId),
        selectedBlockClientId: clientId
      };
    },
    []
  );
  const blockHasGlobalStyles = true;
  const previousBlockClientId = usePrevious(selectedBlockClientId);
  useEffect(() => {
    if (selectedBlockClientId === previousBlockClientId) {
      return;
    }
    if (!selectedBlockClientId || !blockHasGlobalStyles) {
      return;
    }
    if (!path || path !== "/blocks" && !path.startsWith("/blocks/")) {
      return;
    }
    const newPath = "/blocks/" + encodeURIComponent(selectedBlockName);
    if (newPath !== path) {
      onPathChange?.(newPath);
    }
  }, [
    selectedBlockClientId,
    previousBlockClientId,
    selectedBlockName,
    blockHasGlobalStyles,
    path,
    onPathChange
  ]);
  return null;
}
export {
  GlobalStylesBlockLink
};
//# sourceMappingURL=block-link.mjs.map
