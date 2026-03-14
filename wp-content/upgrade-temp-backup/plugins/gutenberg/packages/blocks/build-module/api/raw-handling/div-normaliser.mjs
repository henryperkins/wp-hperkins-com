// packages/blocks/src/api/raw-handling/div-normaliser.js
import normaliseBlocks from "./normalise-blocks.mjs";
function divNormaliser(node) {
  if (node.nodeName !== "DIV") {
    return;
  }
  node.innerHTML = normaliseBlocks(node.innerHTML);
}
export {
  divNormaliser as default
};
//# sourceMappingURL=div-normaliser.mjs.map
