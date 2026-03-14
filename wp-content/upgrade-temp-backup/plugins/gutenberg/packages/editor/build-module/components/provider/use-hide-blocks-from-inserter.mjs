// packages/editor/src/components/provider/use-hide-blocks-from-inserter.js
import { useEffect } from "@wordpress/element";
import { addFilter, removeFilter } from "@wordpress/hooks";
var POST_TYPES_ALLOWING_POST_CONTENT_TEMPLATE_PART = [
  "wp_block",
  "wp_template",
  "wp_template_part"
];
function useHideBlocksFromInserter(postType, mode) {
  useEffect(() => {
    addFilter(
      "blockEditor.__unstableCanInsertBlockType",
      "removeTemplatePartsFromInserter",
      (canInsert, blockType) => {
        if (!POST_TYPES_ALLOWING_POST_CONTENT_TEMPLATE_PART.includes(
          postType
        ) && blockType.name === "core/template-part" && mode === "post-only") {
          return false;
        }
        return canInsert;
      }
    );
    addFilter(
      "blockEditor.__unstableCanInsertBlockType",
      "removePostContentFromInserter",
      (canInsert, blockType, rootClientId, { getBlockParentsByBlockName }) => {
        if (!POST_TYPES_ALLOWING_POST_CONTENT_TEMPLATE_PART.includes(
          postType
        ) && blockType.name === "core/post-content") {
          return getBlockParentsByBlockName(rootClientId, "core/query").length > 0;
        }
        return canInsert;
      }
    );
    return () => {
      removeFilter(
        "blockEditor.__unstableCanInsertBlockType",
        "removeTemplatePartsFromInserter"
      );
      removeFilter(
        "blockEditor.__unstableCanInsertBlockType",
        "removePostContentFromInserter"
      );
    };
  }, [postType, mode]);
}
export {
  useHideBlocksFromInserter
};
//# sourceMappingURL=use-hide-blocks-from-inserter.mjs.map
