// packages/block-library/src/template-part/index.js
import { capitalCase } from "change-case";
import { store as coreDataStore } from "@wordpress/core-data";
import { select } from "@wordpress/data";
import { symbolFilled } from "@wordpress/icons";
import { addFilter } from "@wordpress/hooks";
import { decodeEntities } from "@wordpress/html-entities";
import initBlock from "../utils/init-block.mjs";
import metadata from "./block.json";
import edit from "./edit/index.mjs";
import { enhanceTemplatePartVariations } from "./variations.mjs";
var { name } = metadata;
var settings = {
  icon: symbolFilled,
  __experimentalLabel: ({ slug, theme }) => {
    if (!slug) {
      return;
    }
    const { getCurrentTheme, getEditedEntityRecord } = select(coreDataStore);
    const entity = getEditedEntityRecord(
      "postType",
      "wp_template_part",
      (theme || getCurrentTheme()?.stylesheet) + "//" + slug
    );
    if (!entity) {
      return;
    }
    return decodeEntities(entity.title) || capitalCase(entity.slug || "");
  },
  edit
};
var init = () => {
  addFilter(
    "blocks.registerBlockType",
    "core/template-part",
    enhanceTemplatePartVariations
  );
  const DISALLOWED_PARENTS = ["core/post-template", "core/post-content"];
  addFilter(
    "blockEditor.__unstableCanInsertBlockType",
    "core/block-library/removeTemplatePartsFromPostTemplates",
    (canInsert, blockType, rootClientId, { getBlock, getBlockParentsByBlockName }) => {
      if (blockType.name !== "core/template-part") {
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
