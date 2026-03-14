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

// packages/core-data/src/utils/crdt-utils.ts
var crdt_utils_exports = {};
__export(crdt_utils_exports, {
  createYMap: () => createYMap,
  findBlockByClientIdInDoc: () => findBlockByClientIdInDoc,
  getRootMap: () => getRootMap,
  isYMap: () => isYMap
});
module.exports = __toCommonJS(crdt_utils_exports);
var import_sync = require("@wordpress/sync");
var import_sync2 = require("../sync.cjs");
function getRootMap(doc, key) {
  return doc.getMap(key);
}
function createYMap(partial = {}) {
  return new import_sync.Y.Map(Object.entries(partial));
}
function isYMap(value) {
  return value instanceof import_sync.Y.Map;
}
function findBlockByClientIdInDoc(blockId, ydoc) {
  const ymap = getRootMap(ydoc, import_sync2.CRDT_RECORD_MAP_KEY);
  const blocks = ymap.get("blocks");
  if (!(blocks instanceof import_sync.Y.Array)) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createYMap,
  findBlockByClientIdInDoc,
  getRootMap,
  isYMap
});
//# sourceMappingURL=crdt-utils.cjs.map
