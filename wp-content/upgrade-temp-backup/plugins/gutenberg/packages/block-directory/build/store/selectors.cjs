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

// packages/block-directory/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  getDownloadableBlocks: () => getDownloadableBlocks,
  getErrorNoticeForBlock: () => getErrorNoticeForBlock,
  getErrorNotices: () => getErrorNotices,
  getInstalledBlockTypes: () => getInstalledBlockTypes,
  getNewBlockTypes: () => getNewBlockTypes,
  getUnusedBlockTypes: () => getUnusedBlockTypes,
  isInstalling: () => isInstalling,
  isRequestingDownloadableBlocks: () => isRequestingDownloadableBlocks
});
module.exports = __toCommonJS(selectors_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var EMPTY_ARRAY = [];
function isRequestingDownloadableBlocks(state, filterValue) {
  return state.downloadableBlocks[filterValue]?.isRequesting ?? false;
}
function getDownloadableBlocks(state, filterValue) {
  return state.downloadableBlocks[filterValue]?.results ?? EMPTY_ARRAY;
}
function getInstalledBlockTypes(state) {
  return state.blockManagement.installedBlockTypes;
}
var getNewBlockTypes = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(
    (state) => {
      const installedBlockTypes = getInstalledBlockTypes(state);
      if (!installedBlockTypes.length) {
        return EMPTY_ARRAY;
      }
      const { getBlockName, getClientIdsWithDescendants } = select(import_block_editor.store);
      const installedBlockNames = installedBlockTypes.map(
        (blockType) => blockType.name
      );
      const foundBlockNames = getClientIdsWithDescendants().flatMap(
        (clientId) => {
          const blockName = getBlockName(clientId);
          return installedBlockNames.includes(blockName) ? blockName : [];
        }
      );
      const newBlockTypes = installedBlockTypes.filter(
        (blockType) => foundBlockNames.includes(blockType.name)
      );
      return newBlockTypes.length > 0 ? newBlockTypes : EMPTY_ARRAY;
    },
    (state) => [
      getInstalledBlockTypes(state),
      select(import_block_editor.store).getClientIdsWithDescendants()
    ]
  )
);
var getUnusedBlockTypes = (0, import_data.createRegistrySelector)(
  (select) => (0, import_data.createSelector)(
    (state) => {
      const installedBlockTypes = getInstalledBlockTypes(state);
      if (!installedBlockTypes.length) {
        return EMPTY_ARRAY;
      }
      const { getBlockName, getClientIdsWithDescendants } = select(import_block_editor.store);
      const installedBlockNames = installedBlockTypes.map(
        (blockType) => blockType.name
      );
      const foundBlockNames = getClientIdsWithDescendants().flatMap(
        (clientId) => {
          const blockName = getBlockName(clientId);
          return installedBlockNames.includes(blockName) ? blockName : [];
        }
      );
      const unusedBlockTypes = installedBlockTypes.filter(
        (blockType) => !foundBlockNames.includes(blockType.name)
      );
      return unusedBlockTypes.length > 0 ? unusedBlockTypes : EMPTY_ARRAY;
    },
    (state) => [
      getInstalledBlockTypes(state),
      select(import_block_editor.store).getClientIdsWithDescendants()
    ]
  )
);
function isInstalling(state, blockId) {
  return state.blockManagement.isInstalling[blockId] || false;
}
function getErrorNotices(state) {
  return state.errorNotices;
}
function getErrorNoticeForBlock(state, blockId) {
  return state.errorNotices[blockId];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDownloadableBlocks,
  getErrorNoticeForBlock,
  getErrorNotices,
  getInstalledBlockTypes,
  getNewBlockTypes,
  getUnusedBlockTypes,
  isInstalling,
  isRequestingDownloadableBlocks
});
//# sourceMappingURL=selectors.cjs.map
