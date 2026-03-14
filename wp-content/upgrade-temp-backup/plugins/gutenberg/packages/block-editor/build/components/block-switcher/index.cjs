"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-editor/src/components/block-switcher/index.js
var block_switcher_exports = {};
__export(block_switcher_exports, {
  BlockSwitcher: () => BlockSwitcher,
  default: () => block_switcher_default
});
module.exports = __toCommonJS(block_switcher_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_store = require("../../store/index.cjs");
var import_block_transformations_menu = __toESM(require("./block-transformations-menu.cjs"));
var import_block_variation_transformations = require("./block-variation-transformations.cjs");
var import_block_styles_menu = __toESM(require("./block-styles-menu.cjs"));
var import_pattern_transformations_menu = __toESM(require("./pattern-transformations-menu.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function BlockSwitcherDropdownMenuContents({ onClose, clientIds }) {
  const { replaceBlocks, multiSelect, updateBlockAttributes } = (0, import_data.useDispatch)(import_store.store);
  const {
    possibleBlockTransformations,
    patterns,
    blocks,
    isUsingBindings,
    canRemove,
    hasBlockStyles
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        getBlockAttributes,
        getBlocksByClientId,
        getBlockRootClientId,
        getBlockTransformItems,
        __experimentalGetPatternTransformItems,
        canRemoveBlocks,
        getBlockName
      } = select(import_store.store);
      const { getBlockStyles } = select(import_blocks.store);
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
  const blockVariationTransformations = (0, import_block_variation_transformations.useBlockVariationTransforms)({
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
    const newBlocks = (0, import_blocks.switchToBlockType)(blocks, name);
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
  const isSynced = isSingleBlock && ((0, import_blocks.isTemplatePart)(blocks[0]) || (0, import_blocks.isReusableBlock)(blocks[0]));
  const hasPossibleBlockTransformations = !!possibleBlockTransformations?.length && canRemove && !isSynced;
  const hasPossibleBlockVariationTransformations = !!blockVariationTransformations?.length;
  const hasPatternTransformation = !!patterns?.length && canRemove;
  const hasBlockOrBlockVariationTransforms = hasPossibleBlockTransformations || hasPossibleBlockVariationTransformations;
  const hasContents = hasBlockStyles || hasBlockOrBlockVariationTransforms || hasPatternTransformation;
  if (!hasContents) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "block-editor-block-switcher__no-transforms", children: (0, import_i18n.__)("No transforms.") });
  }
  const connectedBlockDescription = isSingleBlock ? (0, import_i18n._x)(
    "This block is connected.",
    "block toolbar button label and description"
  ) : (0, import_i18n._x)(
    "These blocks are connected.",
    "block toolbar button label and description"
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "block-editor-block-switcher__container", children: [
    hasPatternTransformation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_pattern_transformations_menu.default,
      {
        blocks,
        patterns,
        onSelect: (transformedBlocks) => {
          onPatternTransform(transformedBlocks);
          onClose();
        }
      }
    ),
    hasBlockOrBlockVariationTransforms && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_transformations_menu.default,
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
    hasBlockStyles && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_block_styles_menu.default,
      {
        hoveredBlock: blocks[0],
        onSwitch: onClose
      }
    ),
    isUsingBindings && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.MenuGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { className: "block-editor-block-switcher__binding-indicator", children: connectedBlockDescription }) })
  ] });
}
var BlockSwitcher = ({ children, clientIds, label, text }) => {
  const isSingleBlock = clientIds.length === 1;
  const blockSwitcherDescription = isSingleBlock ? (0, import_i18n.__)("Change block type or style") : (0, import_i18n.sprintf)(
    /* translators: %d: number of blocks. */
    (0, import_i18n._n)(
      "Change type of %d block",
      "Change type of %d blocks",
      clientIds.length
    ),
    clientIds.length
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ToolbarItem, { children: (toggleProps) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.DropdownMenu,
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
      children: ({ onClose }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockSwitcher
});
//# sourceMappingURL=index.cjs.map
