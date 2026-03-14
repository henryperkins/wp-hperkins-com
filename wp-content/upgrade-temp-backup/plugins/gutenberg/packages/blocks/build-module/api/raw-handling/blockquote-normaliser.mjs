// packages/blocks/src/api/raw-handling/blockquote-normaliser.js
import normaliseBlocks from "./normalise-blocks.mjs";
function blockquoteNormaliser(options) {
  return (node) => {
    if (node.nodeName !== "BLOCKQUOTE") {
      return;
    }
    node.innerHTML = normaliseBlocks(node.innerHTML, options);
  };
}
export {
  blockquoteNormaliser as default
};
//# sourceMappingURL=blockquote-normaliser.mjs.map
