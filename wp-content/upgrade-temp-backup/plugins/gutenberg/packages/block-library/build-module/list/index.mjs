// packages/block-library/src/list/index.js
import { list as icon } from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    innerBlocks: [
      {
        name: "core/list-item",
        attributes: { content: __("Alice.") }
      },
      {
        name: "core/list-item",
        attributes: { content: __("The White Rabbit.") }
      },
      {
        name: "core/list-item",
        attributes: { content: __("The Cheshire Cat.") }
      },
      {
        name: "core/list-item",
        attributes: { content: __("The Mad Hatter.") }
      },
      {
        name: "core/list-item",
        attributes: { content: __("The Queen of Hearts.") }
      }
    ]
  },
  transforms,
  edit,
  save,
  deprecated
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
