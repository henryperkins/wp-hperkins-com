// packages/block-library/src/accordion-panel/index.js
import { contents as icon } from "@wordpress/icons";
import edit from "./edit.mjs";
import save from "./save.mjs";
import metadata from "./block.json";
import initBlock from "../utils/init-block.mjs";
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
