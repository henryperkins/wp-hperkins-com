// packages/block-library/src/nextpage/index.js
import { pageBreak as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {},
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
