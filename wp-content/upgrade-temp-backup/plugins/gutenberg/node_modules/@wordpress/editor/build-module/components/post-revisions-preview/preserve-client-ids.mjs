// packages/editor/src/components/post-revisions-preview/preserve-client-ids.js
import { diffArrays } from "diff/lib/diff/array";
function preserveClientIds(newBlocks, prevBlocks) {
  if (!prevBlocks?.length || !newBlocks?.length) {
    return newBlocks;
  }
  const newSigs = newBlocks.map((block) => block.name);
  const prevSigs = prevBlocks.map((block) => block.name);
  const diffResult = diffArrays(prevSigs, newSigs);
  let newIndex = 0;
  let prevIndex = 0;
  const result = [];
  for (const chunk of diffResult) {
    if (chunk.removed) {
      prevIndex += chunk.count;
    } else if (chunk.added) {
      for (let i = 0; i < chunk.count; i++) {
        result.push(newBlocks[newIndex++]);
      }
    } else {
      for (let i = 0; i < chunk.count; i++) {
        const newBlock = newBlocks[newIndex++];
        const prevBlock = prevBlocks[prevIndex++];
        result.push({
          ...newBlock,
          clientId: prevBlock.clientId,
          innerBlocks: preserveClientIds(
            newBlock.innerBlocks,
            prevBlock.innerBlocks
          )
        });
      }
    }
  }
  return result;
}
export {
  preserveClientIds
};
//# sourceMappingURL=preserve-client-ids.mjs.map
