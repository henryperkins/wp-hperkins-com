// packages/block-library/src/comment-author-avatar/index.js
import { commentAuthorAvatar as icon } from "@wordpress/icons";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
var { name } = metadata;
var settings = {
  icon,
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
