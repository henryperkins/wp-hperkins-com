// packages/block-library/src/tag-cloud/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  from: [
    {
      type: "block",
      blocks: ["core/categories"],
      transform: () => createBlock("core/tag-cloud")
    }
  ],
  to: [
    {
      type: "block",
      blocks: ["core/categories"],
      transform: () => createBlock("core/categories")
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
