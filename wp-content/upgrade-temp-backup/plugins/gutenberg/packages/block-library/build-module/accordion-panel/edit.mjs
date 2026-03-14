// packages/block-library/src/accordion-panel/edit.js
import {
  useBlockProps,
  useInnerBlocksProps,
  store as blockEditorStore
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { jsx } from "react/jsx-runtime";
function Edit({ attributes, context, clientId, isSelected }) {
  const { allowedBlocks, templateLock } = attributes;
  const openByDefault = context["core/accordion-open-by-default"];
  const { hasSelection } = useSelect(
    (select) => {
      if (isSelected || openByDefault) {
        return { hasSelection: true };
      }
      const {
        getBlockRootClientId,
        isBlockSelected,
        hasSelectedInnerBlock
      } = select(blockEditorStore);
      const rootClientId = getBlockRootClientId(clientId);
      return {
        hasSelection: isBlockSelected(rootClientId) || hasSelectedInnerBlock(rootClientId, true)
      };
    },
    [clientId, isSelected, openByDefault]
  );
  const blockProps = useBlockProps({
    "aria-hidden": !hasSelection,
    role: "region"
  });
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    allowedBlocks,
    template: [["core/paragraph", {}]],
    templateLock
  });
  return /* @__PURE__ */ jsx("div", { ...innerBlocksProps });
}
export {
  Edit as default
};
//# sourceMappingURL=edit.mjs.map
