// packages/block-library/src/html/index.js
import { __ } from "@wordpress/i18n";
import { html as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      content: "<marquee>" + __("Welcome to the wonderful world of blocks\u2026") + "</marquee>"
    }
  },
  edit,
  save,
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
