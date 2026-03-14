// packages/block-library/src/tab/index.js
import { tab as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import save from "./save.mjs";
import metadata from "./block.json";
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
