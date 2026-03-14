// packages/block-library/src/icon/index.js
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import icon from "./icon.mjs";
var { name } = metadata;
var settings = {
  icon,
  example: {
    attributes: {
      icon: "core/audio",
      style: {
        dimensions: {
          width: "48px"
        }
      }
    }
  },
  edit
};
var init = () => initBlock({ name, metadata, settings });
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
