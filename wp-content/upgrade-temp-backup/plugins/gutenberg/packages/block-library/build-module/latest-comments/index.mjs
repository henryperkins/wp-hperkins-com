// packages/block-library/src/latest-comments/index.js
import { comment as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {},
  edit,
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
