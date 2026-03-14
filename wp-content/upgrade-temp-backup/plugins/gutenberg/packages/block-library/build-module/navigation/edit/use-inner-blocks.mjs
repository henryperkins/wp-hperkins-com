// packages/block-library/src/navigation/edit/use-inner-blocks.js
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
var EMPTY_ARRAY = [];
function useInnerBlocks(clientId) {
  return useSelect(
    (select) => {
      const { getBlock, getBlocks, hasSelectedInnerBlock } = select(blockEditorStore);
      const _uncontrolledInnerBlocks = getBlock(clientId).innerBlocks;
      const _hasUncontrolledInnerBlocks = !!_uncontrolledInnerBlocks?.length;
      const _controlledInnerBlocks = _hasUncontrolledInnerBlocks ? EMPTY_ARRAY : getBlocks(clientId);
      return {
        innerBlocks: _hasUncontrolledInnerBlocks ? _uncontrolledInnerBlocks : _controlledInnerBlocks,
        hasUncontrolledInnerBlocks: _hasUncontrolledInnerBlocks,
        uncontrolledInnerBlocks: _uncontrolledInnerBlocks,
        controlledInnerBlocks: _controlledInnerBlocks,
        isInnerBlockSelected: hasSelectedInnerBlock(clientId, true)
      };
    },
    [clientId]
  );
}
export {
  useInnerBlocks
};
//# sourceMappingURL=use-inner-blocks.mjs.map
