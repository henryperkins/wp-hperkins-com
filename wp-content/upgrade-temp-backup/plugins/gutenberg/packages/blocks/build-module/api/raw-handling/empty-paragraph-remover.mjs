// packages/blocks/src/api/raw-handling/empty-paragraph-remover.js
function emptyParagraphRemover(node) {
  if (node.nodeName !== "P") {
    return;
  }
  if (node.hasChildNodes()) {
    return;
  }
  node.parentNode.removeChild(node);
}
export {
  emptyParagraphRemover as default
};
//# sourceMappingURL=empty-paragraph-remover.mjs.map
