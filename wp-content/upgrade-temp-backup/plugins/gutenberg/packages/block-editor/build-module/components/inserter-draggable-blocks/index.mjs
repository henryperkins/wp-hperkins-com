// packages/block-editor/src/components/inserter-draggable-blocks/index.js
import { Draggable } from "@wordpress/components";
import { createBlock, store as blocksStore } from "@wordpress/blocks";
import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import BlockDraggableChip from "../block-draggable/draggable-chip.mjs";
import { INSERTER_PATTERN_TYPES } from "../inserter/block-patterns-tab/utils.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx } from "react/jsx-runtime";
var InserterDraggableBlocks = ({
  isEnabled,
  blocks,
  icon,
  children,
  pattern
}) => {
  const blockName = blocks.length === 1 ? blocks[0].name : void 0;
  const blockTypeIcon = useSelect(
    (select) => {
      return blockName && select(blocksStore).getBlockType(blockName)?.icon;
    },
    [blockName]
  );
  const { startDragging, stopDragging } = unlock(
    useDispatch(blockEditorStore)
  );
  const patternBlock = useMemo(() => {
    return pattern?.type === INSERTER_PATTERN_TYPES.user && pattern?.syncStatus !== "unsynced" ? [createBlock("core/block", { ref: pattern.id })] : void 0;
  }, [pattern?.type, pattern?.syncStatus, pattern?.id]);
  if (!isEnabled) {
    return children({
      draggable: false,
      onDragStart: void 0,
      onDragEnd: void 0
    });
  }
  const draggableBlocks = patternBlock ?? blocks;
  return /* @__PURE__ */ jsx(
    Draggable,
    {
      __experimentalTransferDataType: "wp-blocks",
      transferData: { type: "inserter", blocks: draggableBlocks },
      onDragStart: (event) => {
        startDragging();
        const addedTypes = /* @__PURE__ */ new Set();
        for (const block of draggableBlocks) {
          const type = `wp-block:${block.name}`;
          if (!addedTypes.has(type)) {
            event.dataTransfer.items.add("", type);
            addedTypes.add(type);
          }
        }
      },
      onDragEnd: () => {
        stopDragging();
      },
      __experimentalDragComponent: /* @__PURE__ */ jsx(
        BlockDraggableChip,
        {
          count: blocks.length,
          icon: icon || !pattern && blockTypeIcon,
          isPattern: !!pattern
        }
      ),
      children: ({ onDraggableStart, onDraggableEnd }) => {
        return children({
          draggable: true,
          onDragStart: onDraggableStart,
          onDragEnd: onDraggableEnd
        });
      }
    }
  );
};
var inserter_draggable_blocks_default = InserterDraggableBlocks;
export {
  inserter_draggable_blocks_default as default
};
//# sourceMappingURL=index.mjs.map
