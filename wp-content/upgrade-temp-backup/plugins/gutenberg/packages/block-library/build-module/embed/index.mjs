// packages/block-library/src/embed/index.js
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import save from "./save.mjs";
import metadata from "./block.json";
import transforms from "./transforms.mjs";
import variations from "./variations.mjs";
import deprecated from "./deprecated.mjs";
import { embedContentIcon } from "./icons.mjs";
var { name } = metadata;
var settings = {
  icon: embedContentIcon,
  edit,
  save,
  transforms,
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
