// packages/block-library/src/form/index.js
import { addFilter } from "@wordpress/hooks";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
import variations from "./variations.mjs";
import deprecated from "./deprecated.mjs";
import { icon } from "./icons.mjs";
var { name } = metadata;
var settings = {
  icon,
  edit,
  save,
  deprecated,
  variations,
  example: {}
};
var init = () => {
  const DISALLOWED_PARENTS = ["core/form"];
  addFilter(
    "blockEditor.__unstableCanInsertBlockType",
    "core/block-library/preventInsertingFormIntoAnotherForm",
    (canInsert, blockType, rootClientId, { getBlock, getBlockParentsByBlockName }) => {
      if (blockType.name !== "core/form") {
        return canInsert;
      }
      for (const disallowedParentType of DISALLOWED_PARENTS) {
        const hasDisallowedParent = getBlock(rootClientId)?.name === disallowedParentType || getBlockParentsByBlockName(
          rootClientId,
          disallowedParentType
        ).length;
        if (hasDisallowedParent) {
          return false;
        }
      }
      return true;
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
