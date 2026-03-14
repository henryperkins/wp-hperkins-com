// packages/block-editor/src/components/block-switcher/block-variation-transformations.js
import { MenuItem } from "@wordpress/components";
import {
  getBlockMenuDefaultClassName,
  cloneBlock,
  store as blocksStore
} from "@wordpress/blocks";
import { useSelect } from "@wordpress/data";
import { useState, useMemo } from "@wordpress/element";
import { store as blockEditorStore } from "../../store/index.mjs";
import BlockIcon from "../block-icon/index.mjs";
import PreviewBlockPopover from "./preview-block-popover.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var EMPTY_OBJECT = {};
function useBlockVariationTransforms({ clientIds, blocks }) {
  const { activeBlockVariation, blockVariationTransformations } = useSelect(
    (select) => {
      const { getBlockAttributes, canRemoveBlocks } = select(blockEditorStore);
      const { getActiveBlockVariation, getBlockVariations } = select(blocksStore);
      const canRemove = canRemoveBlocks(clientIds);
      if (blocks.length !== 1 || !canRemove) {
        return EMPTY_OBJECT;
      }
      const [firstBlock] = blocks;
      return {
        blockVariationTransformations: getBlockVariations(
          firstBlock.name,
          "transform"
        ),
        activeBlockVariation: getActiveBlockVariation(
          firstBlock.name,
          getBlockAttributes(firstBlock.clientId)
        )
      };
    },
    [clientIds, blocks]
  );
  const transformations = useMemo(() => {
    return blockVariationTransformations?.filter(
      ({ name }) => name !== activeBlockVariation?.name
    );
  }, [blockVariationTransformations, activeBlockVariation]);
  return transformations;
}
var BlockVariationTransformations = ({
  transformations,
  onSelect,
  blocks
}) => {
  const [hoveredTransformItemName, setHoveredTransformItemName] = useState();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    hoveredTransformItemName && /* @__PURE__ */ jsx(
      PreviewBlockPopover,
      {
        blocks: cloneBlock(
          blocks[0],
          transformations.find(
            ({ name }) => name === hoveredTransformItemName
          ).attributes
        )
      }
    ),
    transformations?.map((item) => /* @__PURE__ */ jsx(
      BlockVariationTransformationItem,
      {
        item,
        onSelect,
        setHoveredTransformItemName
      },
      item.name
    ))
  ] });
};
function BlockVariationTransformationItem({
  item,
  onSelect,
  setHoveredTransformItemName
}) {
  const { name, icon, title } = item;
  return /* @__PURE__ */ jsxs(
    MenuItem,
    {
      className: getBlockMenuDefaultClassName(name),
      onClick: (event) => {
        event.preventDefault();
        onSelect(name);
      },
      onMouseLeave: () => setHoveredTransformItemName(null),
      onMouseEnter: () => setHoveredTransformItemName(name),
      onFocus: () => setHoveredTransformItemName(name),
      onBlur: () => setHoveredTransformItemName(null),
      children: [
        /* @__PURE__ */ jsx(BlockIcon, { icon, showColors: true }),
        title
      ]
    }
  );
}
var block_variation_transformations_default = BlockVariationTransformations;
export {
  block_variation_transformations_default as default,
  useBlockVariationTransforms
};
//# sourceMappingURL=block-variation-transformations.mjs.map
