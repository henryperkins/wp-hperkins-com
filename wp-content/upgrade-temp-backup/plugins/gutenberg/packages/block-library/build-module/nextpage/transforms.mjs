// packages/block-library/src/nextpage/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  from: [
    {
      type: "raw",
      schema: {
        "wp-block": { attributes: ["data-block"] }
      },
      isMatch: (node) => node.dataset && node.dataset.block === "core/nextpage",
      transform() {
        return createBlock("core/nextpage", {});
      }
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
