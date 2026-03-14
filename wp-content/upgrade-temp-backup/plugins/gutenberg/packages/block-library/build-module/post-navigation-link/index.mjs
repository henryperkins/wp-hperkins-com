// packages/block-library/src/post-navigation-link/index.js
import { __ } from "@wordpress/i18n";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import variations from "./variations.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  edit,
  variations,
  deprecated,
  example: {
    attributes: {
      label: __("Next post"),
      arrow: "arrow"
    }
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
