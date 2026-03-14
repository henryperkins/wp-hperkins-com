// packages/block-library/src/terms-query/index.js
import { loop as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit/index.mjs";
import save from "./save.mjs";
import variations from "./variations.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  save,
  example: {},
  variations
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
