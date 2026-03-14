// packages/block-library/src/navigation-overlay-close/index.js
import { addFilter } from "@wordpress/hooks";
import initBlock from "../utils/init-block.mjs";
import { isWithinNavigationOverlay } from "../utils/is-within-overlay.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import icon from "./icon.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit
};
var init = () => {
  addFilter(
    "blockEditor.__unstableCanInsertBlockType",
    "core/navigation-overlay-close/restrict-to-overlay-template-parts",
    (canInsert, blockType) => {
      if (blockType.name !== "core/navigation-overlay-close") {
        return canInsert;
      }
      if (!canInsert) {
        return canInsert;
      }
      return isWithinNavigationOverlay();
    }
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
