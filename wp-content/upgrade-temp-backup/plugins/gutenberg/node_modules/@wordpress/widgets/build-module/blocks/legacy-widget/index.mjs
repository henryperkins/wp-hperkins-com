// packages/widgets/src/blocks/legacy-widget/index.js
import { widget as icon } from "@wordpress/icons";
import metadata from "./block.json";
import edit from "./edit/index.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  transforms
};
export {
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
