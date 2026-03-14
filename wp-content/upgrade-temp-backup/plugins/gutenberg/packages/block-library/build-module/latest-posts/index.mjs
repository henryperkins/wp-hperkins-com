// packages/block-library/src/latest-posts/index.js
import { postList as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
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
