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

// packages/blocks/src/api/raw-handling/heading-transformer.js
var heading_transformer_exports = {};
__export(heading_transformer_exports, {
  default: () => headingTransformer
});
module.exports = __toCommonJS(heading_transformer_exports);
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
//# sourceMappingURL=heading-transformer.cjs.map
