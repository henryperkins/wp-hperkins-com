// packages/block-library/src/shortcode/index.js
import { shortcode as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
import metadata from "./block.json";
var { name } = metadata;
var settings = {
  icon,
  transforms,
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
