// packages/block-editor/src/components/block-bindings/use-block-bindings-utils.js
import { useDispatch, useRegistry } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { useBlockEditContext } from "../block-edit/index.mjs";
function isObjectEmpty(object) {
  return !object || Object.keys(object).length === 0;
}
function useBlockBindingsUtils(clientId) {
  const { clientId: contextClientId } = useBlockEditContext();
  const blockClientId = clientId || contextClientId;
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const { getBlockAttributes } = useRegistry().select(blockEditorStore);
  const updateBlockBindings = (bindings) => {
    const { metadata: { bindings: currentBindings, ...metadata } = {} } = getBlockAttributes(blockClientId);
    const newBindings = { ...currentBindings };
    Object.entries(bindings).forEach(([attribute, binding]) => {
      if (!binding && newBindings[attribute]) {
        delete newBindings[attribute];
        return;
      }
      newBindings[attribute] = binding;
    });
    const newMetadata = {
      ...metadata,
      bindings: newBindings
    };
    if (isObjectEmpty(newMetadata.bindings)) {
      delete newMetadata.bindings;
    }
    updateBlockAttributes(blockClientId, {
      metadata: isObjectEmpty(newMetadata) ? void 0 : newMetadata
    });
  };
  const removeAllBlockBindings = () => {
    const { metadata: { bindings, ...metadata } = {} } = getBlockAttributes(blockClientId);
    updateBlockAttributes(blockClientId, {
      metadata: isObjectEmpty(metadata) ? void 0 : metadata
    });
  };
  return { updateBlockBindings, removeAllBlockBindings };
}
export {
  useBlockBindingsUtils as default
};
//# sourceMappingURL=use-block-bindings-utils.mjs.map
