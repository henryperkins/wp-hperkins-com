// packages/block-library/src/spacer/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  to: [
    {
      type: "block",
      blocks: ["core/separator"],
      // Transform to Separator.
      transform: ({ anchor }) => {
        return createBlock("core/separator", {
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
