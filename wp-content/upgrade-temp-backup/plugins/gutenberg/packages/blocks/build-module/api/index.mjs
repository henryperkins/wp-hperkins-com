// packages/blocks/src/api/index.js
import { lock } from "../lock-unlock.mjs";
import { isContentBlock } from "./utils.mjs";
import {
  createBlock,
  createBlocksFromInnerBlocksTemplate,
  cloneBlock,
  __experimentalCloneSanitizedBlock,
  getPossibleBlockTransformations,
  switchToBlockType,
  getBlockTransforms,
  findTransform,
  getBlockFromExample
} from "./factory.mjs";
import { default as default2 } from "./parser/index.mjs";
import { serializeRawBlock } from "./parser/serialize-raw-block.mjs";
import {
  getBlockAttributes,
  parseWithAttributeSchema
} from "./parser/get-block-attributes.mjs";
import {
  pasteHandler,
  rawHandler,
  deprecatedGetPhrasingContentSchema
} from "./raw-handling/index.mjs";
import {
  default as default3,
  getBlockInnerHTML,
  getBlockDefaultClassName,
  getBlockMenuDefaultClassName,
  getSaveElement,
  getSaveContent,
  getBlockProps,
  getInnerBlocksProps,
  __unstableSerializeAndClean
} from "./serializer.mjs";
import { isValidBlockContent, validateBlock } from "./validation/index.mjs";
import { getCategories, setCategories, updateCategory } from "./categories.mjs";
import {
  registerBlockType,
  registerBlockCollection,
  unregisterBlockType,
  setFreeformContentHandlerName,
  getFreeformContentHandlerName,
  setUnregisteredTypeHandlerName,
  getUnregisteredTypeHandlerName,
  setDefaultBlockName,
  getDefaultBlockName,
  setGroupingBlockName,
  getGroupingBlockName,
  getBlockType,
  getBlockTypes,
  getBlockSupport,
  hasBlockSupport,
  getBlockVariations,
  isReusableBlock,
  isTemplatePart,
  getChildBlockNames,
  hasChildBlocks,
  hasChildBlocksWithInserterSupport,
  unstable__bootstrapServerSideBlockDefinitions,
  registerBlockStyle,
  unregisterBlockStyle,
  registerBlockVariation,
  unregisterBlockVariation,
  registerBlockBindingsSource,
  unregisterBlockBindingsSource,
  getBlockBindingsSource,
  getBlockBindingsSources
} from "./registration.mjs";
import {
  isUnmodifiedBlock,
  isUnmodifiedDefaultBlock,
  normalizeIconObject,
  isValidIcon,
  getBlockLabel,
  getAccessibleBlockLabel,
  __experimentalSanitizeBlockAttributes,
  getBlockAttributesNamesByRole,
  __experimentalGetBlockAttributesNamesByRole
} from "./utils.mjs";
import {
  doBlocksMatchTemplate,
  synchronizeBlocksWithTemplate
} from "./templates.mjs";
import { default as default4 } from "./children.mjs";
import { default as default5 } from "./node.mjs";
import {
  __EXPERIMENTAL_STYLE_PROPERTY,
  __EXPERIMENTAL_ELEMENTS,
  __EXPERIMENTAL_PATHS_WITH_OVERRIDE
} from "./constants.mjs";
import { parseRawBlock as _parseRawBlock } from "./parser/index.mjs";
var fieldsKey = /* @__PURE__ */ Symbol("fields");
var formKey = /* @__PURE__ */ Symbol("form");
var privateApis = {};
lock(privateApis, {
  isContentBlock,
  fieldsKey,
  formKey,
  parseRawBlock: _parseRawBlock
});
export {
  __EXPERIMENTAL_ELEMENTS,
  __EXPERIMENTAL_PATHS_WITH_OVERRIDE,
  __EXPERIMENTAL_STYLE_PROPERTY,
  __experimentalCloneSanitizedBlock,
  getAccessibleBlockLabel as __experimentalGetAccessibleBlockLabel,
  __experimentalGetBlockAttributesNamesByRole,
  getBlockLabel as __experimentalGetBlockLabel,
  __experimentalSanitizeBlockAttributes,
  getBlockProps as __unstableGetBlockProps,
  getInnerBlocksProps as __unstableGetInnerBlocksProps,
  __unstableSerializeAndClean,
  default4 as children,
  cloneBlock,
  createBlock,
  createBlocksFromInnerBlocksTemplate,
  doBlocksMatchTemplate,
  findTransform,
  getBlockAttributes,
  getBlockAttributesNamesByRole,
  getBlockBindingsSource,
  getBlockBindingsSources,
  getBlockInnerHTML as getBlockContent,
  getBlockDefaultClassName,
  getBlockFromExample,
  getBlockMenuDefaultClassName,
  getBlockSupport,
  getBlockTransforms,
  getBlockType,
  getBlockTypes,
  getBlockVariations,
  getCategories,
  getChildBlockNames,
  getDefaultBlockName,
  getFreeformContentHandlerName,
  getGroupingBlockName,
  deprecatedGetPhrasingContentSchema as getPhrasingContentSchema,
  getPossibleBlockTransformations,
  getSaveContent,
  getSaveElement,
  getUnregisteredTypeHandlerName,
  hasBlockSupport,
  hasChildBlocks,
  hasChildBlocksWithInserterSupport,
  isReusableBlock,
  isTemplatePart,
  isUnmodifiedBlock,
  isUnmodifiedDefaultBlock,
  isValidBlockContent,
  isValidIcon,
  default5 as node,
  normalizeIconObject,
  default2 as parse,
  parseWithAttributeSchema,
  pasteHandler,
  privateApis,
  rawHandler,
  registerBlockBindingsSource,
  registerBlockCollection,
  registerBlockStyle,
  registerBlockType,
  registerBlockVariation,
  default3 as serialize,
  serializeRawBlock,
  setCategories,
  setDefaultBlockName,
  setFreeformContentHandlerName,
  setGroupingBlockName,
  setUnregisteredTypeHandlerName,
  switchToBlockType,
  synchronizeBlocksWithTemplate,
  unregisterBlockBindingsSource,
  unregisterBlockStyle,
  unregisterBlockType,
  unregisterBlockVariation,
  unstable__bootstrapServerSideBlockDefinitions,
  updateCategory,
  validateBlock
};
//# sourceMappingURL=index.mjs.map
