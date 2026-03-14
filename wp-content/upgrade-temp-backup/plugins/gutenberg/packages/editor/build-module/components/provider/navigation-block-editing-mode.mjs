// packages/editor/src/components/provider/navigation-block-editing-mode.js
import { useEffect } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
function NavigationBlockEditingMode() {
  const blockClientId = useSelect(
    (select) => select(blockEditorStore).getBlockOrder()?.[0],
    []
  );
  const { setBlockEditingMode, unsetBlockEditingMode } = useDispatch(blockEditorStore);
  useEffect(() => {
    if (!blockClientId) {
      return;
    }
    setBlockEditingMode(blockClientId, "contentOnly");
    return () => {
      unsetBlockEditingMode(blockClientId);
    };
  }, [blockClientId, unsetBlockEditingMode, setBlockEditingMode]);
}
export {
  NavigationBlockEditingMode as default
};
//# sourceMappingURL=navigation-block-editing-mode.mjs.map
