// packages/block-library/src/buttons/index.js
import { __ } from "@wordpress/i18n";
import { buttons as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import transforms from "./transforms.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      layout: {
        type: "flex",
        justifyContent: "center"
      }
    },
    innerBlocks: [
      {
        name: "core/button",
        attributes: { text: __("Find out more") }
      },
      {
        name: "core/button",
        attributes: { text: __("Contact us") }
      }
    ]
  },
  deprecated,
  transforms,
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
