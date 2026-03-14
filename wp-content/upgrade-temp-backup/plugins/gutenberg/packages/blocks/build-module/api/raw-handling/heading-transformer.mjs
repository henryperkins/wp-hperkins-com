// packages/blocks/src/api/raw-handling/heading-transformer.js
function headingTransformer(node) {
  if (node.nodeType !== node.ELEMENT_NODE) {
    return;
  }
  if (node.tagName === "P" && node.getAttribute("role") === "heading" && node.hasAttribute("aria-level")) {
    const level = parseInt(node.getAttribute("aria-level"), 10);
    if (level >= 1 && level <= 6) {
      const headingTag = `H${level}`;
      const newHeading = node.ownerDocument.createElement(headingTag);
      Array.from(node.attributes).forEach((attr) => {
        if (attr.name !== "role" && attr.name !== "aria-level") {
          newHeading.setAttribute(attr.name, attr.value);
        }
      });
      while (node.firstChild) {
        newHeading.appendChild(node.firstChild);
      }
      node.parentNode.replaceChild(newHeading, node);
    }
  }
}
export {
  headingTransformer as default
};
//# sourceMappingURL=heading-transformer.mjs.map
