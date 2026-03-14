// packages/block-library/src/spacer/index.js
import { resizeCornerNE as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import deprecated from "./deprecated.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import transforms from "./transforms.mjs";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  icon,
  transforms,
  edit,
  save,
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
