// packages/block-library/src/post-terms/index.js
import { postCategories as icon } from "@wordpress/icons";
import { addFilter } from "@wordpress/hooks";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import enhanceVariations from "./hooks.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  deprecated
};
var init = () => {
  addFilter(
    "blocks.registerBlockType",
    "core/template-part",
    enhanceVariations
  );
  return initBlock({ name, metadata, settings });
};
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
