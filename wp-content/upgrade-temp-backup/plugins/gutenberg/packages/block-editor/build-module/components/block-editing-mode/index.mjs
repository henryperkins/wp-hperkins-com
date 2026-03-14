// packages/block-editor/src/components/block-editing-mode/index.js
import { useSelect, useDispatch } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { store as blockEditorStore } from "../../store/index.mjs";
import {
  useBlockEditContext,
  blockEditingModeKey
} from "../block-edit/context.mjs";
function useBlockEditingMode(mode) {
  const context = useBlockEditContext();
  const { clientId = "" } = context;
  const { setBlockEditingMode, unsetBlockEditingMode } = useDispatch(blockEditorStore);
  const globalBlockEditingMode = useSelect(
    (select) => (
      // Avoid adding the subscription if not needed!
      clientId ? null : select(blockEditorStore).getBlockEditingMode()
    ),
    [clientId]
  );
  useEffect(() => {
    if (mode) {
      setBlockEditingMode(clientId, mode);
    }
    return () => {
      if (mode) {
        unsetBlockEditingMode(clientId);
      }
    };
  }, [clientId, mode, setBlockEditingMode, unsetBlockEditingMode]);
  return clientId ? context[blockEditingModeKey] : globalBlockEditingMode;
}
export {
  useBlockEditingMode
};
//# sourceMappingURL=index.mjs.map
