// packages/block-library/src/form-input/index.js
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import variations from "./variations.mjs";
import { icon } from "./icons.mjs";
var { name } = metadata;
var settings = {
  icon,
  deprecated,
  edit,
  save,
  variations,
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
