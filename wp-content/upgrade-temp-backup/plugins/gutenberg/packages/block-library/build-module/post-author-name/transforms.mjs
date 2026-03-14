// packages/block-library/src/post-author-name/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  from: [
    {
      type: "block",
      blocks: ["core/post-author"],
      transform: ({ textAlign }) => createBlock("core/post-author-name", {
        style: { typography: { textAlign } }
      })
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
