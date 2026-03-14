// packages/block-library/src/comments/index.js
import { postComments as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import deprecated from "./deprecated.mjs";
import edit from "./edit/index.mjs";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {},
  edit,
  save,
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
