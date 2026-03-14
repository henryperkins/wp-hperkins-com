// packages/block-library/src/site-logo/index.js
import { siteLogo as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {},
  edit,
  transforms
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
