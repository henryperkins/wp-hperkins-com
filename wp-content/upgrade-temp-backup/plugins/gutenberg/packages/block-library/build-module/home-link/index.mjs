// packages/block-library/src/home-link/index.js
import { _x } from "@wordpress/i18n";
import { home } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  icon: home,
  edit,
  save,
  example: {
    attributes: {
      label: _x("Home Link", "block example")
    }
  }
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
