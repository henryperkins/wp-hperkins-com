// packages/block-library/src/comment-date/index.js
import { postDate as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  deprecated,
  example: {}
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
