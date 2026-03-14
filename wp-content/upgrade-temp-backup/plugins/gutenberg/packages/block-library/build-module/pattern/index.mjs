// packages/block-library/src/pattern/index.js
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import PatternEdit from "./edit.mjs";
var { name } = metadata;
var settings = {
  edit: PatternEdit
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
