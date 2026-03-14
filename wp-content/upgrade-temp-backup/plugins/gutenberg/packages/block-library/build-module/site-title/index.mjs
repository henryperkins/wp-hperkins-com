// packages/block-library/src/site-title/index.js
import { mapMarker as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import deprecated from "./deprecated.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    viewportWidth: 350,
    attributes: {
      textAlign: "center"
    }
  },
  edit,
  transforms,
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
