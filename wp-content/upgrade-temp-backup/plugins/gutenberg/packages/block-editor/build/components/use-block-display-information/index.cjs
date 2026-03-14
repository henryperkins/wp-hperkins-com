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

// packages/block-editor/src/components/use-block-display-information/index.js
var use_block_display_information_exports = {};
__export(use_block_display_information_exports, {
  default: () => useBlockDisplayInformation
});
module.exports = __toCommonJS(use_block_display_information_exports);
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_store = require("../../store/index.cjs");
function getPositionTypeLabel(attributes) {
  const positionType = attributes?.style?.position?.type;
  if (positionType === "sticky") {
    return (0, import_i18n.__)("Sticky");
  }
  if (positionType === "fixed") {
    return (0, import_i18n.__)("Fixed");
  }
  return null;
}
function useBlockDisplayInformation(clientId) {
  return (0, import_data.useSelect)(
    (select) => {
      if (!clientId) {
        return null;
      }
      const {
        getBlockName,
        getBlockAttributes,
        __experimentalGetParsedPattern
      } = select(import_store.store);
      const { getBlockType, getActiveBlockVariation } = select(import_blocks.store);
      const blockName = getBlockName(clientId);
      const blockType = getBlockType(blockName);
      if (!blockType) {
        return null;
      }
      const attributes = getBlockAttributes(clientId);
      const patternName = attributes?.metadata?.patternName;
      if (patternName) {
        const pattern = __experimentalGetParsedPattern(patternName);
        const positionLabel2 = getPositionTypeLabel(attributes);
        return {
          isSynced: false,
          title: (0, import_i18n.__)("Pattern"),
          icon: import_icons.symbol,
          description: pattern?.description || (0, import_i18n.__)("A block pattern."),
          anchor: attributes?.anchor,
          positionLabel: positionLabel2,
          positionType: attributes?.style?.position?.type,
          name: pattern?.title || attributes?.metadata?.name
        };
      }
      const match = getActiveBlockVariation(blockName, attributes);
      const isSynced = (0, import_blocks.isReusableBlock)(blockType) || (0, import_blocks.isTemplatePart)(blockType);
      const syncedTitle = isSynced ? (0, import_blocks.__experimentalGetBlockLabel)(blockType, attributes) : void 0;
      const title = syncedTitle || blockType.title;
      const positionLabel = getPositionTypeLabel(attributes);
      const blockTypeInfo = {
        isSynced,
        title,
        icon: blockType.icon,
        description: blockType.description,
        anchor: attributes?.anchor,
        positionLabel,
        positionType: attributes?.style?.position?.type,
        name: attributes?.metadata?.name
      };
      if (!match) {
        return blockTypeInfo;
      }
      return {
        isSynced,
        title: match.title || blockType.title,
        icon: match.icon || blockType.icon,
        description: match.description || blockType.description,
        anchor: attributes?.anchor,
        positionLabel,
        positionType: attributes?.style?.position?.type,
        name: attributes?.metadata?.name
      };
    },
    [clientId]
  );
}
//# sourceMappingURL=index.cjs.map
