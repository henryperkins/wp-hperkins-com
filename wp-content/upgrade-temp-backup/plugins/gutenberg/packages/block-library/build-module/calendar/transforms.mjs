// packages/block-library/src/calendar/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  from: [
    {
      type: "block",
      blocks: ["core/archives"],
      transform: () => createBlock("core/calendar")
    }
  ],
  to: [
    {
      type: "block",
      blocks: ["core/archives"],
      transform: () => createBlock("core/archives")
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
