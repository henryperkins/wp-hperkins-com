// packages/blocks/src/api/raw-handling/head-remover.js
function headRemover(node) {
  if (node.nodeName !== "SCRIPT" && node.nodeName !== "NOSCRIPT" && node.nodeName !== "TEMPLATE" && node.nodeName !== "STYLE") {
    return;
  }
  node.parentNode.removeChild(node);
}
export {
  headRemover as default
};
//# sourceMappingURL=head-remover.mjs.map
