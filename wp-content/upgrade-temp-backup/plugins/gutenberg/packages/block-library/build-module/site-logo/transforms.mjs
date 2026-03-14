// packages/block-library/src/site-logo/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  to: [
    {
      type: "block",
      blocks: ["core/site-title"],
      transform: ({ isLink, linkTarget }) => {
        return createBlock("core/site-title", {
          isLink,
          linkTarget
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
