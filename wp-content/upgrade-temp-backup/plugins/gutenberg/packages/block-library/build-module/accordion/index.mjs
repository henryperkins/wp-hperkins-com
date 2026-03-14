// packages/block-library/src/accordion/index.js
import { __ } from "@wordpress/i18n";
import { accordion as icon } from "@wordpress/icons";
import edit from "./edit.mjs";
import save from "./save.mjs";
import metadata from "./block.json";
import initBlock from "../utils/init-block.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    innerBlocks: [
      {
        name: "core/accordion-item",
        innerBlocks: [
          {
            name: "core/accordion-heading",
            attributes: {
              title: __(
                "Lorem ipsum dolor sit amet, consectetur."
              )
            }
          }
        ]
      },
      {
        name: "core/accordion-item",
        innerBlocks: [
          {
            name: "core/accordion-heading",
            attributes: {
              title: __(
                "Suspendisse commodo lacus, interdum et."
              )
            }
          }
        ]
      }
    ]
  },
  edit,
  save
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
