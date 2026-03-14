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

// packages/core-data/src/awareness/block-lookup.ts
var block_lookup_exports = {};
__export(block_lookup_exports, {
  getBlockPathInYdoc: () => getBlockPathInYdoc,
  resolveBlockClientIdByPath: () => resolveBlockClientIdByPath
});
module.exports = __toCommonJS(block_lookup_exports);
var import_data = require("@wordpress/data");
var import_sync = require("@wordpress/sync");
var import_block_editor = require("@wordpress/block-editor");
function getBlockPathInYdoc(yType) {
  const path = [];
  let current = yType;
  while (current) {
    const parentArray = current.parent;
    if (!parentArray || !(parentArray instanceof import_sync.Y.Array)) {
      return null;
    }
    let index = -1;
    for (let i = 0; i < parentArray.length; i++) {
      if (parentArray.get(i) === current) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      return null;
    }
    path.unshift(index);
    const grandparent = parentArray.parent;
    if (grandparent instanceof import_sync.Y.Map && grandparent.get("clientId") !== void 0) {
      current = grandparent;
    } else {
      break;
    }
  }
  return path;
}
function resolveBlockClientIdByPath(path) {
  if (path.length === 0) {
    return null;
  }
  const { getBlocks } = (0, import_data.select)(import_block_editor.store);
  const postContentBlocks = getPostContentBlocks(getBlocks(), getBlocks);
  let blocks = postContentBlocks;
  for (let i = 0; i < path.length; i++) {
    const block = blocks[path[i]];
    if (!block) {
      return null;
    }
    if (i === path.length - 1) {
      return block.clientId;
    }
    blocks = block.innerBlocks;
  }
  return null;
}
function getPostContentBlocks(rootBlocks, getBlocks) {
  const postContentBlock = findBlockByName(rootBlocks, "core/post-content");
  if (postContentBlock) {
    return getBlocks(postContentBlock.clientId);
  }
  return rootBlocks;
}
function findBlockByName(blocks, name) {
  for (const block of blocks) {
    if (block.name === name) {
      return block;
    }
    if (block.innerBlocks?.length) {
      const found = findBlockByName(block.innerBlocks, name);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBlockPathInYdoc,
  resolveBlockClientIdByPath
});
//# sourceMappingURL=block-lookup.cjs.map
