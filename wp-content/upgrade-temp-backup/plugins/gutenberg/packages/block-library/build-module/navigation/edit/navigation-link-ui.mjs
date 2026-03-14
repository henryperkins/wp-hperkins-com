// packages/block-library/src/navigation/edit/navigation-link-ui.js
import { store as blockEditorStore } from "@wordpress/block-editor";
import { useDispatch } from "@wordpress/data";
import {
  LinkUI,
  updateAttributes,
  useEntityBinding
} from "../../navigation-link/shared/index.mjs";
import { jsx } from "react/jsx-runtime";
var BLOCKS_WITH_LINK_UI_SUPPORT = [
  "core/navigation-link",
  "core/navigation-submenu"
];
function NavigationLinkUI({ block, insertedBlock, setInsertedBlock }) {
  const { updateBlockAttributes, removeBlock } = useDispatch(blockEditorStore);
  const supportsLinkControls = BLOCKS_WITH_LINK_UI_SUPPORT?.includes(
    insertedBlock?.name
  );
  const blockWasJustInserted = insertedBlock?.clientId === block.clientId;
  const showLinkControls = supportsLinkControls && blockWasJustInserted;
  const { createBinding, clearBinding } = useEntityBinding({
    clientId: insertedBlock?.clientId,
    attributes: insertedBlock?.attributes || {}
  });
  if (!showLinkControls) {
    return null;
  }
  const cleanupInsertedBlock = () => {
    const shouldAutoSelectBlock = false;
    if (!insertedBlock?.attributes?.url && insertedBlock?.clientId) {
      removeBlock(insertedBlock.clientId, shouldAutoSelectBlock);
    }
    setInsertedBlock(null);
  };
  const setInsertedBlockAttributes = (_insertedBlockClientId) => (_updatedAttributes) => {
    if (!_insertedBlockClientId) {
      return;
    }
    updateBlockAttributes(_insertedBlockClientId, _updatedAttributes);
  };
  const handleSetInsertedBlock = (newBlock) => {
    const shouldAutoSelectBlock = false;
    if (insertedBlock?.clientId && newBlock) {
      removeBlock(insertedBlock.clientId, shouldAutoSelectBlock);
    }
    setInsertedBlock(newBlock);
  };
  return /* @__PURE__ */ jsx(
    LinkUI,
    {
      clientId: insertedBlock?.clientId,
      link: insertedBlock?.attributes,
      onBlockInsert: handleSetInsertedBlock,
      onClose: () => {
        cleanupInsertedBlock();
      },
      onChange: (updatedValue) => {
        const { isEntityLink, attributes: updatedAttributes } = updateAttributes(
          updatedValue,
          setInsertedBlockAttributes(insertedBlock?.clientId),
          insertedBlock?.attributes
        );
        if (isEntityLink) {
          createBinding(updatedAttributes);
        } else {
          clearBinding();
        }
        setInsertedBlock(null);
      }
    }
  );
}
export {
  NavigationLinkUI
};
//# sourceMappingURL=navigation-link-ui.mjs.map
