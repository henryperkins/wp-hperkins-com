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

// packages/editor/src/components/post-revisions-preview/preserve-client-ids.js
var preserve_client_ids_exports = {};
__export(preserve_client_ids_exports, {
  preserveClientIds: () => preserveClientIds
});
module.exports = __toCommonJS(preserve_client_ids_exports);
var import_array = require("diff/lib/diff/array");
function preserveClientIds(newBlocks, prevBlocks) {
  if (!prevBlocks?.length || !newBlocks?.length) {
    return newBlocks;
  }
  const newSigs = newBlocks.map((block) => block.name);
  const prevSigs = prevBlocks.map((block) => block.name);
  const diffResult = (0, import_array.diffArrays)(prevSigs, newSigs);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  preserveClientIds
});
//# sourceMappingURL=preserve-client-ids.cjs.map
