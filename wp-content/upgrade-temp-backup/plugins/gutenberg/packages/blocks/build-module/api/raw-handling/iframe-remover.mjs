// packages/blocks/src/api/raw-handling/iframe-remover.js
function iframeRemover(node) {
  if (node.nodeName === "IFRAME") {
    const text = node.ownerDocument.createTextNode(node.src);
    node.parentNode.replaceChild(text, node);
  }
}
export {
  iframeRemover as default
};
//# sourceMappingURL=iframe-remover.mjs.map
