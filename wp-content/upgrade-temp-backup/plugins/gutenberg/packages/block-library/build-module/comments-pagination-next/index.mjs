// packages/block-library/src/comments-pagination-next/index.js
import { __ } from "@wordpress/i18n";
import { queryPaginationNext as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  example: {
    attributes: {
      label: __("Newer Comments")
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
