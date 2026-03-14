// packages/block-library/src/block/index.js
import { symbol as icon } from "@wordpress/icons";
import { store as coreStore } from "@wordpress/core-data";
import { select } from "@wordpress/data";
import { decodeEntities } from "@wordpress/html-entities";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit.mjs";
import deprecated from "./deprecated.mjs";
var { name } = metadata;
var settings = {
  deprecated,
  edit,
  icon,
  __experimentalLabel: ({ ref }) => {
    if (!ref) {
      return;
    }
    const entity = select(coreStore).getEditedEntityRecord(
      "postType",
      "wp_block",
      ref
    );
    if (!entity?.title) {
      return;
    }
    return decodeEntities(entity.title);
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
