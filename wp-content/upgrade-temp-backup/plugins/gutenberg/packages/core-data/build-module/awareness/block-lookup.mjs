// packages/core-data/src/awareness/block-lookup.ts
import { select } from "@wordpress/data";
import { Y } from "@wordpress/sync";
import { store as blockEditorStore } from "@wordpress/block-editor";
function getBlockPathInYdoc(yType) {
  const path = [];
  let current = yType;
  while (current) {
    const parentArray = current.parent;
    if (!parentArray || !(parentArray instanceof Y.Array)) {
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
    if (grandparent instanceof Y.Map && grandparent.get("clientId") !== void 0) {
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
  const { getBlocks } = select(blockEditorStore);
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
export {
  getBlockPathInYdoc,
  resolveBlockClientIdByPath
};
//# sourceMappingURL=block-lookup.mjs.map
