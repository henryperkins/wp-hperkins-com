// packages/block-directory/src/store/selectors.js
import { createSelector, createRegistrySelector } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
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
var getNewBlockTypes = createRegistrySelector(
  (select) => createSelector(
    (state) => {
      const installedBlockTypes = getInstalledBlockTypes(state);
      if (!installedBlockTypes.length) {
        return EMPTY_ARRAY;
      }
      const { getBlockName, getClientIdsWithDescendants } = select(blockEditorStore);
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
      select(blockEditorStore).getClientIdsWithDescendants()
    ]
  )
);
var getUnusedBlockTypes = createRegistrySelector(
  (select) => createSelector(
    (state) => {
      const installedBlockTypes = getInstalledBlockTypes(state);
      if (!installedBlockTypes.length) {
        return EMPTY_ARRAY;
      }
      const { getBlockName, getClientIdsWithDescendants } = select(blockEditorStore);
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
      select(blockEditorStore).getClientIdsWithDescendants()
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
export {
  getDownloadableBlocks,
  getErrorNoticeForBlock,
  getErrorNotices,
  getInstalledBlockTypes,
  getNewBlockTypes,
  getUnusedBlockTypes,
  isInstalling,
  isRequestingDownloadableBlocks
};
//# sourceMappingURL=selectors.mjs.map
