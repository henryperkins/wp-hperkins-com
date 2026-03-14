// packages/block-editor/src/components/block-toolbar/use-has-block-toolbar.js
import { useSelect } from "@wordpress/data";
import { getBlockType, hasBlockSupport } from "@wordpress/blocks";
import { store as blockEditorStore } from "../../store/index.mjs";
function useHasBlockToolbar() {
  const enabled = useSelect((select) => {
    const { getBlockEditingMode, getBlockName, getBlockSelectionStart } = select(blockEditorStore);
    const selectedBlockClientId = getBlockSelectionStart();
    const blockType = selectedBlockClientId && getBlockType(getBlockName(selectedBlockClientId));
    return blockType && hasBlockSupport(blockType, "__experimentalToolbar", true) && getBlockEditingMode(selectedBlockClientId) !== "disabled";
  }, []);
  return enabled;
}
export {
  useHasBlockToolbar
};
//# sourceMappingURL=use-has-block-toolbar.mjs.map
