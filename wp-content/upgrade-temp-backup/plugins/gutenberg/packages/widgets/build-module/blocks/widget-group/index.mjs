// packages/widgets/src/blocks/widget-group/index.js
import { __ } from "@wordpress/i18n";
import { createBlock } from "@wordpress/blocks";
import { group as icon } from "@wordpress/icons";
import metadata from "./block.json";
import edit from "./edit.mjs";
import save from "./save.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  title: __("Widget Group"),
  description: __(
    "Create a classic widget layout with a title that\u2019s styled by your theme for your widget areas."
  ),
  icon,
  __experimentalLabel: ({ name: label }) => label,
  edit,
  save,
  transforms: {
    from: [
      {
        type: "block",
        isMultiBlock: true,
        blocks: ["*"],
        isMatch(attributes, blocks) {
          return !blocks.some(
            (block) => block.name === "core/widget-group"
          );
        },
        __experimentalConvert(blocks) {
          let innerBlocks = [
            ...blocks.map((block) => {
              return createBlock(
                block.name,
                block.attributes,
                block.innerBlocks
              );
            })
          ];
          const firstHeadingBlock = innerBlocks[0].name === "core/heading" ? innerBlocks[0] : null;
          innerBlocks = innerBlocks.filter(
            (block) => block !== firstHeadingBlock
          );
          return createBlock(
            "core/widget-group",
            {
              ...firstHeadingBlock && {
                title: firstHeadingBlock.attributes.content
              }
            },
            innerBlocks
          );
        }
      }
    ]
  },
  deprecated
};
export {
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
