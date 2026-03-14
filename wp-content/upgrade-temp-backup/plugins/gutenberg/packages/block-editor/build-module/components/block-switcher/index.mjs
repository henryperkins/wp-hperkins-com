// packages/block-editor/src/components/block-switcher/index.js
import { __, _n, sprintf, _x } from "@wordpress/i18n";
import {
  DropdownMenu,
  ToolbarGroup,
  ToolbarItem,
  __experimentalText as Text,
  MenuGroup
} from "@wordpress/components";
import {
  switchToBlockType,
  store as blocksStore,
  isReusableBlock,
  isTemplatePart
} from "@wordpress/blocks";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as blockEditorStore } from "../../store/index.mjs";
import BlockTransformationsMenu from "./block-transformations-menu.mjs";
import { useBlockVariationTransforms } from "./block-variation-transformations.mjs";
import BlockStylesMenu from "./block-styles-menu.mjs";
import PatternTransformationsMenu from "./pattern-transformations-menu.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockSwitcherDropdownMenuContents({ onClose, clientIds }) {
  const { replaceBlocks, multiSelect, updateBlockAttributes } = useDispatch(blockEditorStore);
  const {
    possibleBlockTransformations,
    patterns,
    blocks,
    isUsingBindings,
    canRemove,
    hasBlockStyles
  } = useSelect(
    (select) => {
      const {
        getBlockAttributes,
        getBlocksByClientId,
        getBlockRootClientId,
        getBlockTransformItems,
        __experimentalGetPatternTransformItems,
        canRemoveBlocks,
        getBlockName
      } = select(blockEditorStore);
      const { getBlockStyles } = select(blocksStore);
      const rootClientId = getBlockRootClientId(clientIds[0]);
      const _blocks = getBlocksByClientId(clientIds);
      const _isSingleBlock = clientIds.length === 1;
      const _blockName = _isSingleBlock && getBlockName(clientIds[0]);
      const _hasBlockStyles = _isSingleBlock && !!getBlockStyles(_blockName)?.length;
      return {
        blocks: _blocks,
        possibleBlockTransformations: getBlockTransformItems(
          _blocks,
          rootClientId
        ),
        patterns: __experimentalGetPatternTransformItems(
          _blocks,
          rootClientId
        ),
        isUsingBindings: clientIds.every(
          (clientId) => !!getBlockAttributes(clientId)?.metadata?.bindings
        ),
        canRemove: canRemoveBlocks(clientIds),
        hasBlockStyles: _hasBlockStyles
      };
    },
    [clientIds]
  );
  const blockVariationTransformations = useBlockVariationTransforms({
    clientIds,
    blocks
  });
  function selectForMultipleBlocks(insertedBlocks) {
    if (insertedBlocks.length > 1) {
      multiSelect(
        insertedBlocks[0].clientId,
        insertedBlocks[insertedBlocks.length - 1].clientId
      );
    }
  }
  function onBlockTransform(name) {
    const newBlocks = switchToBlockType(blocks, name);
    replaceBlocks(clientIds, newBlocks);
    selectForMultipleBlocks(newBlocks);
  }
  function onBlockVariationTransform(name) {
    updateBlockAttributes(blocks[0].clientId, {
      ...blockVariationTransformations.find(
        ({ name: variationName }) => variationName === name
      ).attributes
    });
  }
  function onPatternTransform(transformedBlocks) {
    replaceBlocks(clientIds, transformedBlocks);
    selectForMultipleBlocks(transformedBlocks);
  }
  const isSingleBlock = blocks.length === 1;
  const isSynced = isSingleBlock && (isTemplatePart(blocks[0]) || isReusableBlock(blocks[0]));
  const hasPossibleBlockTransformations = !!possibleBlockTransformations?.length && canRemove && !isSynced;
  const hasPossibleBlockVariationTransformations = !!blockVariationTransformations?.length;
  const hasPatternTransformation = !!patterns?.length && canRemove;
  const hasBlockOrBlockVariationTransforms = hasPossibleBlockTransformations || hasPossibleBlockVariationTransformations;
  const hasContents = hasBlockStyles || hasBlockOrBlockVariationTransforms || hasPatternTransformation;
  if (!hasContents) {
    return /* @__PURE__ */ jsx("p", { className: "block-editor-block-switcher__no-transforms", children: __("No transforms.") });
  }
  const connectedBlockDescription = isSingleBlock ? _x(
    "This block is connected.",
    "block toolbar button label and description"
  ) : _x(
    "These blocks are connected.",
    "block toolbar button label and description"
  );
  return /* @__PURE__ */ jsxs("div", { className: "block-editor-block-switcher__container", children: [
    hasPatternTransformation && /* @__PURE__ */ jsx(
      PatternTransformationsMenu,
      {
        blocks,
        patterns,
        onSelect: (transformedBlocks) => {
          onPatternTransform(transformedBlocks);
          onClose();
        }
      }
    ),
    hasBlockOrBlockVariationTransforms && /* @__PURE__ */ jsx(
      BlockTransformationsMenu,
      {
        className: "block-editor-block-switcher__transforms__menugroup",
        possibleBlockTransformations,
        possibleBlockVariationTransformations: blockVariationTransformations,
        blocks,
        onSelect: (name) => {
          onBlockTransform(name);
          onClose();
        },
        onSelectVariation: (name) => {
          onBlockVariationTransform(name);
          onClose();
        }
      }
    ),
    hasBlockStyles && /* @__PURE__ */ jsx(
      BlockStylesMenu,
      {
        hoveredBlock: blocks[0],
        onSwitch: onClose
      }
    ),
    isUsingBindings && /* @__PURE__ */ jsx(MenuGroup, { children: /* @__PURE__ */ jsx(Text, { className: "block-editor-block-switcher__binding-indicator", children: connectedBlockDescription }) })
  ] });
}
var BlockSwitcher = ({ children, clientIds, label, text }) => {
  const isSingleBlock = clientIds.length === 1;
  const blockSwitcherDescription = isSingleBlock ? __("Change block type or style") : sprintf(
    /* translators: %d: number of blocks. */
    _n(
      "Change type of %d block",
      "Change type of %d blocks",
      clientIds.length
    ),
    clientIds.length
  );
  return /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(ToolbarItem, { children: (toggleProps) => /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      className: "block-editor-block-switcher",
      label,
      popoverProps: {
        placement: "bottom-start",
        className: "block-editor-block-switcher__popover"
      },
      icon: children,
      text,
      toggleProps: {
        description: blockSwitcherDescription,
        ...toggleProps
      },
      menuProps: { orientation: "both" },
      children: ({ onClose }) => /* @__PURE__ */ jsx(
        BlockSwitcherDropdownMenuContents,
        {
          onClose,
          clientIds
        }
      )
    }
  ) }) });
};
var block_switcher_default = BlockSwitcher;
export {
  BlockSwitcher,
  block_switcher_default as default
};
//# sourceMappingURL=index.mjs.map
