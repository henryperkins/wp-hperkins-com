// packages/block-library/src/query-title/index.js
import { title as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import variations from "./variations.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  variations,
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
