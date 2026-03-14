// packages/block-editor/src/components/list-view/use-list-view-collapse-items.js
import { useEffect } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
function useListViewCollapseItems({ collapseAll, expand }) {
  const { expandedBlock, getBlockParents } = useSelect((select) => {
    const { getBlockParents: _getBlockParents, getExpandedBlock } = unlock(
      select(blockEditorStore)
    );
    return {
      expandedBlock: getExpandedBlock(),
      getBlockParents: _getBlockParents
    };
  }, []);
  useEffect(() => {
    if (expandedBlock) {
      const blockParents = getBlockParents(expandedBlock, false);
      collapseAll();
      expand(blockParents);
    }
  }, [collapseAll, expand, expandedBlock, getBlockParents]);
}
export {
  useListViewCollapseItems as default
};
//# sourceMappingURL=use-list-view-collapse-items.mjs.map
