// packages/block-library/src/post-comments-link/index.js
import { postCommentsCount as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import transforms from "./transforms.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  edit,
  icon,
  transforms,
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
