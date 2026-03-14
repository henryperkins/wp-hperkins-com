// packages/block-library/src/comment-template/index.js
import { layout as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  save
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
