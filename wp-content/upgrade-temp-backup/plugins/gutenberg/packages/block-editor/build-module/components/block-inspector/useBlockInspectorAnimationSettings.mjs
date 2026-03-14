// packages/block-editor/src/components/block-inspector/useBlockInspectorAnimationSettings.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
function useBlockInspectorAnimationSettings(blockType) {
  return useSelect(
    (select) => {
      if (blockType) {
        const globalBlockInspectorAnimationSettings = select(blockEditorStore).getSettings().blockInspectorAnimation;
        const animationParent = globalBlockInspectorAnimationSettings?.animationParent;
        const { getSelectedBlockClientId, getBlockParentsByBlockName } = select(blockEditorStore);
        const _selectedBlockClientId = getSelectedBlockClientId();
        const animationParentBlockClientId = getBlockParentsByBlockName(
          _selectedBlockClientId,
          animationParent,
          true
        )[0];
        if (!animationParentBlockClientId && blockType.name !== animationParent) {
          return null;
        }
        return globalBlockInspectorAnimationSettings?.[blockType.name];
      }
      return null;
    },
    [blockType]
  );
}
export {
  useBlockInspectorAnimationSettings as default
};
//# sourceMappingURL=useBlockInspectorAnimationSettings.mjs.map
