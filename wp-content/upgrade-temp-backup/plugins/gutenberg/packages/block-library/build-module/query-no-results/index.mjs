// packages/block-library/src/query-no-results/index.js
import { __ } from "@wordpress/i18n";
import { loop as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  save,
  example: {
    innerBlocks: [
      {
        name: "core/paragraph",
        attributes: {
          content: __("No posts were found.")
        }
      }
    ]
  }
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
