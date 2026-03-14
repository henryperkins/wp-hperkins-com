// packages/block-library/src/post-author/index.js
import { __ } from "@wordpress/i18n";
import { postAuthor as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    viewportWidth: 350,
    attributes: {
      showBio: true,
      byline: __("Posted by")
    }
  },
  edit
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
