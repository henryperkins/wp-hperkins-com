// packages/block-library/src/site-tagline/index.js
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import icon from "./icon.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
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
