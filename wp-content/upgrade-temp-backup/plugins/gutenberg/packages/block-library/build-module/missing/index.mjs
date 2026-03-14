// packages/block-library/src/missing/index.js
import { getBlockType } from "@wordpress/blocks";
import initBlock from "../utils/init-block.mjs";
import edit from "./edit.mjs";
import metadata from "./block.json";
import save from "./save.mjs";
var { name } = metadata;
var settings = {
  name,
  __experimentalLabel(attributes, { context }) {
    if (context === "accessibility") {
      const { originalName } = attributes;
      const originalBlockType = originalName ? getBlockType(originalName) : void 0;
      if (originalBlockType) {
        return originalBlockType.settings.title || originalName;
      }
      return "";
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
