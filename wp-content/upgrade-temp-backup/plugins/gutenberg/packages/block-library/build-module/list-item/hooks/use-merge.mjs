// packages/block-library/src/list-item/hooks/use-merge.js
import { useRegistry, useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { isUnmodifiedBlock } from "@wordpress/blocks";
import useOutdentListItem from "./use-outdent-list-item.mjs";
function useMerge(clientId, onMerge) {
  const registry = useRegistry();
  const {
    getPreviousBlockClientId,
    getNextBlockClientId,
    getBlockOrder,
    getBlockRootClientId,
    getBlockName,
    getBlock
  } = useSelect(blockEditorStore);
  const { mergeBlocks, moveBlocksToPosition, removeBlock } = useDispatch(blockEditorStore);
  const outdentListItem = useOutdentListItem();
  function getTrailingId(id) {
    const order = getBlockOrder(id);
    if (!order.length) {
      return id;
    }
    return getTrailingId(order[order.length - 1]);
  }
  function getParentListItemId(id) {
    const listId = getBlockRootClientId(id);
    const parentListItemId = getBlockRootClientId(listId);
    if (!parentListItemId) {
      return;
    }
    if (getBlockName(parentListItemId) !== "core/list-item") {
      return;
    }
    return parentListItemId;
  }
  function _getNextId(id) {
    const next = getNextBlockClientId(id);
    if (next) {
      return next;
    }
    const parentListItemId = getParentListItemId(id);
    if (!parentListItemId) {
      return;
    }
    return _getNextId(parentListItemId);
  }
  function getNextId(id) {
    const order = getBlockOrder(id);
    if (!order.length) {
      return _getNextId(id);
    }
    return getBlockOrder(order[0])[0];
  }
  return (forward) => {
    function mergeWithNested(clientIdA, clientIdB) {
      registry.batch(() => {
        const [nestedListClientId] = getBlockOrder(clientIdB);
        if (nestedListClientId) {
          if (getPreviousBlockClientId(clientIdB) === clientIdA && !getBlockOrder(clientIdA).length) {
            moveBlocksToPosition(
              [nestedListClientId],
              clientIdB,
              clientIdA
            );
          } else {
            moveBlocksToPosition(
              getBlockOrder(nestedListClientId),
              nestedListClientId,
              getBlockRootClientId(clientIdA)
            );
          }
        }
        mergeBlocks(clientIdA, clientIdB);
      });
    }
    if (forward) {
      const nextBlockClientId = getNextId(clientId);
      if (!nextBlockClientId) {
        onMerge(forward);
        return;
      }
      if (getParentListItemId(nextBlockClientId)) {
        outdentListItem(nextBlockClientId);
      } else {
        mergeWithNested(clientId, nextBlockClientId);
      }
    } else {
      if (getParentListItemId(clientId)) {
        outdentListItem(clientId);
        return;
      }
      const previousBlockClientId = getPreviousBlockClientId(clientId);
      if (previousBlockClientId) {
        const trailingId = getTrailingId(previousBlockClientId);
        mergeWithNested(trailingId, clientId);
        return;
      }
      const blockOrder = getBlockOrder(clientId);
      if (isUnmodifiedBlock(getBlock(clientId), "content") && blockOrder.length > 0) {
        registry.batch(() => {
          outdentListItem(getBlockOrder(blockOrder[0]));
          removeBlock(clientId, true);
        });
      } else {
        onMerge(forward);
      }
    }
  };
}
export {
  useMerge as default
};
//# sourceMappingURL=use-merge.mjs.map
