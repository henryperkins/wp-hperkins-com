// packages/core-data/src/utils/crdt-utils.ts
import { Y } from "@wordpress/sync";
import { CRDT_RECORD_MAP_KEY } from "../sync.mjs";
function getRootMap(doc, key) {
  return doc.getMap(key);
}
function createYMap(partial = {}) {
  return new Y.Map(Object.entries(partial));
}
function isYMap(value) {
  return value instanceof Y.Map;
}
function findBlockByClientIdInDoc(blockId, ydoc) {
  const ymap = getRootMap(ydoc, CRDT_RECORD_MAP_KEY);
  const blocks = ymap.get("blocks");
  if (!(blocks instanceof Y.Array)) {
    return null;
  }
  return findBlockByClientIdInBlocks(blockId, blocks);
}
function findBlockByClientIdInBlocks(blockId, blocks) {
  for (const block of blocks) {
    if (block.get("clientId") === blockId) {
      return block;
    }
    const innerBlocks = block.get("innerBlocks");
    if (innerBlocks && innerBlocks.length > 0) {
      const innerBlock = findBlockByClientIdInBlocks(
        blockId,
        innerBlocks
      );
      if (innerBlock) {
        return innerBlock;
      }
    }
  }
  return null;
}
export {
  createYMap,
  findBlockByClientIdInDoc,
  getRootMap,
  isYMap
};
//# sourceMappingURL=crdt-utils.mjs.map
