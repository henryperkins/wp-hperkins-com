// packages/block-library/src/quote/index.js
import { __ } from "@wordpress/i18n";
import { quote as icon } from "@wordpress/icons";
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
    attributes: {
      citation: __("Julio Cort\xE1zar")
    },
    innerBlocks: [
      {
        name: "core/paragraph",
        attributes: {
          content: __("In quoting others, we cite ourselves.")
        }
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
