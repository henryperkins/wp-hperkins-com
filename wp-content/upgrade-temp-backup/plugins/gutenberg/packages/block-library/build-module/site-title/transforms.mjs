// packages/block-library/src/site-title/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  to: [
    {
      type: "block",
      blocks: ["core/site-logo"],
      transform: ({ isLink, linkTarget }) => {
        return createBlock("core/site-logo", {
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
