// packages/block-library/src/playlist/index.js
import { audio as icon } from "@wordpress/icons";
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
