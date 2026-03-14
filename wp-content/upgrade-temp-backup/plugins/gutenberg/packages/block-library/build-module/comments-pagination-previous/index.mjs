// packages/block-library/src/comments-pagination-previous/index.js
import { __ } from "@wordpress/i18n";
import { queryPaginationPrevious as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  example: {
    attributes: {
      label: __("Older Comments")
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
