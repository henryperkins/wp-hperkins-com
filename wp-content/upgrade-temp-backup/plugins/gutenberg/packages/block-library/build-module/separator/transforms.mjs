// packages/block-library/src/separator/transforms.js
import { createBlock, getDefaultBlockName } from "@wordpress/blocks";
var transforms = {
  from: [
    {
      type: "input",
      regExp: /^-{3,}$/,
      transform: () => [
        createBlock("core/separator"),
        createBlock(getDefaultBlockName())
      ]
    },
    {
      type: "raw",
      selector: "hr",
      schema: {
        hr: {}
      }
    }
  ],
  to: [
    {
      type: "block",
      blocks: ["core/spacer"],
      // Transform to Spacer.
      transform: ({ anchor }) => {
        return createBlock("core/spacer", {
          anchor: anchor || void 0
        });
      }
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
