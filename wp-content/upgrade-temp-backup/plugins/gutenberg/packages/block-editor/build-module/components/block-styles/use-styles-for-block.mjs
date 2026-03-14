// packages/block-editor/src/components/block-styles/use-styles-for-block.js
import { useDispatch, useSelect } from "@wordpress/data";
import {
  cloneBlock,
  getBlockType,
  getBlockFromExample,
  store as blocksStore
} from "@wordpress/blocks";
import { useMemo } from "@wordpress/element";
import { getActiveStyle, getRenderedStyles, replaceActiveStyle } from "./utils.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
function useGenericPreviewBlock(block, type) {
  return useMemo(() => {
    const example = type?.example;
    const blockName = type?.name;
    if (example && blockName) {
      return getBlockFromExample(blockName, {
        attributes: example.attributes,
        innerBlocks: example.innerBlocks
      });
    }
    if (block) {
      return cloneBlock(block);
    }
  }, [block, type?.example, type?.name]);
}
function useStylesForBlocks({ clientId, onSwitch }) {
  const selector = (select) => {
    const { getBlock } = select(blockEditorStore);
    const block2 = getBlock(clientId);
    if (!block2) {
      return {};
    }
    const blockType2 = getBlockType(block2.name);
    const { getBlockStyles } = select(blocksStore);
    return {
      block: !blockType2?.example ? block2 : null,
      blockType: blockType2,
      styles: getBlockStyles(block2.name),
      className: block2.attributes.className || ""
    };
  };
  const { styles, block, blockType, className } = useSelect(selector, [
    clientId
  ]);
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const stylesToRender = getRenderedStyles(styles);
  const activeStyle = getActiveStyle(stylesToRender, className);
  const genericPreviewBlock = useGenericPreviewBlock(block, blockType);
  const onSelect = (style) => {
    const styleClassName = replaceActiveStyle(
      className,
      activeStyle,
      style
    );
    updateBlockAttributes(clientId, {
      className: styleClassName
    });
    onSwitch();
  };
  return {
    onSelect,
    stylesToRender,
    activeStyle,
    genericPreviewBlock,
    className
  };
}
export {
  useStylesForBlocks as default
};
//# sourceMappingURL=use-styles-for-block.mjs.map
