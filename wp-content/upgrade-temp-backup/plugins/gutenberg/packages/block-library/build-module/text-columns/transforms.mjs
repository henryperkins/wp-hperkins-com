// packages/block-library/src/text-columns/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  to: [
    {
      type: "block",
      blocks: ["core/columns"],
      transform: ({ className, columns, content, width }) => createBlock(
        "core/columns",
        {
          align: "wide" === width || "full" === width ? width : void 0,
          className,
          columns
        },
        content.map(
          ({ children }) => createBlock("core/column", {}, [
            createBlock("core/paragraph", {
              content: children
            })
          ])
        )
      )
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
