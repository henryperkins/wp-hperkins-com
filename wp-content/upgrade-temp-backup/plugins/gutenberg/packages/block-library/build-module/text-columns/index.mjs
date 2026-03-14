// packages/block-library/src/text-columns/index.js
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import transforms from "./transforms.mjs";
var { name } = metadata;
var settings = {
  transforms,
  getEditWrapperProps(attributes) {
    const { width } = attributes;
    if ("wide" === width || "full" === width) {
      return { "data-align": width };
    }
  },
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
