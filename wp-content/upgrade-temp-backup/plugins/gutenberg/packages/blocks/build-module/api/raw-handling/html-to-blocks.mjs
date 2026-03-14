// packages/blocks/src/api/raw-handling/html-to-blocks.js
import { Platform } from "@wordpress/element";
import { createBlock, findTransform } from "../factory.mjs";
import parse from "../parser/index.mjs";
import { getBlockAttributes } from "../parser/get-block-attributes.mjs";
import { getRawTransforms } from "./get-raw-transforms.mjs";
function htmlToBlocks(html, handler) {
  const doc = document.implementation.createHTMLDocument("");
  doc.body.innerHTML = html;
  return Array.from(doc.body.children).flatMap((node) => {
    const rawTransform = findTransform(
      getRawTransforms(),
      ({ isMatch }) => isMatch(node)
    );
    if (!rawTransform) {
      if (Platform.isNative) {
        return parse(
          `<!-- wp:html -->${node.outerHTML}<!-- /wp:html -->`
        );
      }
      return createBlock(
        // Should not be hardcoded.
        "core/html",
        getBlockAttributes("core/html", node.outerHTML)
      );
    }
    const { transform, blockName } = rawTransform;
    if (transform) {
      const block = transform(node, handler);
      if (node.hasAttribute("class")) {
        block.attributes.className = node.getAttribute("class");
      }
      return block;
    }
    return createBlock(
      blockName,
      getBlockAttributes(blockName, node.outerHTML)
    );
  });
}
export {
  htmlToBlocks
};
//# sourceMappingURL=html-to-blocks.mjs.map
