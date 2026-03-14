// packages/block-library/src/query-total/index.js
import metadata from "./block.json";
import edit from "./edit.mjs";
import initBlock from "../utils/init-block.mjs";
import { queryTotal } from "./icons.mjs";
var { name } = metadata;
var settings = {
  icon: queryTotal,
  edit
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
