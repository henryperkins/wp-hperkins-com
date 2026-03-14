// packages/block-library/src/form-submit-button/index.js
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  edit,
  save,
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
