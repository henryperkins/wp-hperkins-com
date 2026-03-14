// packages/block-library/src/post-comments-count/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  to: [
    {
      type: "block",
      blocks: ["core/post-comments-link"],
      transform: ({ style }) => {
        const textAlign = style?.typography?.textAlign;
        return createBlock("core/post-comments-link", {
          ...textAlign && {
            style: {
              typography: {
                textAlign
              }
            }
          }
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
