// packages/block-library/src/post-author-name/index.js
import { postAuthor as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import deprecated from "./deprecated.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  icon,
  transforms,
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
