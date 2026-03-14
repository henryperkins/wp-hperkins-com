// packages/block-library/src/footnotes/index.js
import { formatListNumbered as icon } from "@wordpress/icons";
import { registerFormatType } from "@wordpress/rich-text";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import { formatName, format } from "./format.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit
};
var init = () => {
  registerFormatType(formatName, format);
  initBlock({ name, metadata, settings });
};
export {
  init,
  metadata,
  name,
  settings
};
//# sourceMappingURL=index.mjs.map
