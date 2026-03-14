// packages/block-library/src/paragraph/transforms.js
import { createBlock, getBlockAttributes } from "@wordpress/blocks";
import metadata from "./block.json";
var { name } = metadata;
var transforms = {
  from: [
    {
      type: "raw",
      // Paragraph is a fallback and should be matched last.
      priority: 20,
      selector: "p",
      schema: ({ phrasingContentSchema, isPaste }) => ({
        p: {
          children: phrasingContentSchema,
          attributes: isPaste ? [] : ["style", "id"]
        }
      }),
      transform(node) {
        const attributes = getBlockAttributes(name, node.outerHTML);
        const { textAlign } = node.style || {};
        if (textAlign === "left" || textAlign === "center" || textAlign === "right") {
          attributes.style = {
            ...attributes.style,
            typography: {
              ...attributes.style?.typography,
              textAlign
            }
          };
        }
        return createBlock(name, attributes);
      }
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
