"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-styles/use-styles-for-block.js
var use_styles_for_block_exports = {};
__export(use_styles_for_block_exports, {
  default: () => useStylesForBlocks
});
module.exports = __toCommonJS(use_styles_for_block_exports);
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_element = require("@wordpress/element");
var import_utils = require("./utils.cjs");
var import_store = require("../../store/index.cjs");
function useGenericPreviewBlock(block, type) {
  return (0, import_element.useMemo)(() => {
    const example = type?.example;
    const blockName = type?.name;
    if (example && blockName) {
      return (0, import_blocks.getBlockFromExample)(blockName, {
        attributes: example.attributes,
        innerBlocks: example.innerBlocks
      });
    }
    if (block) {
      return (0, import_blocks.cloneBlock)(block);
    }
  }, [block, type?.example, type?.name]);
}
function useStylesForBlocks({ clientId, onSwitch }) {
  const selector = (select) => {
    const { getBlock } = select(import_store.store);
    const block2 = getBlock(clientId);
    if (!block2) {
      return {};
    }
    const blockType2 = (0, import_blocks.getBlockType)(block2.name);
    const { getBlockStyles } = select(import_blocks.store);
    return {
      block: !blockType2?.example ? block2 : null,
      blockType: blockType2,
      styles: getBlockStyles(block2.name),
      className: block2.attributes.className || ""
    };
  };
  const { styles, block, blockType, className } = (0, import_data.useSelect)(selector, [
    clientId
  ]);
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_store.store);
  const stylesToRender = (0, import_utils.getRenderedStyles)(styles);
  const activeStyle = (0, import_utils.getActiveStyle)(stylesToRender, className);
  const genericPreviewBlock = useGenericPreviewBlock(block, blockType);
  const onSelect = (style) => {
    const styleClassName = (0, import_utils.replaceActiveStyle)(
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
//# sourceMappingURL=use-styles-for-block.cjs.map
