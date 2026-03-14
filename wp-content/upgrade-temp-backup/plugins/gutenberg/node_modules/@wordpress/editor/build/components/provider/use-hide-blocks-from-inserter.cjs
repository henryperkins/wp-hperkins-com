"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/provider/use-hide-blocks-from-inserter.js
var use_hide_blocks_from_inserter_exports = {};
__export(use_hide_blocks_from_inserter_exports, {
  useHideBlocksFromInserter: () => useHideBlocksFromInserter
});
module.exports = __toCommonJS(use_hide_blocks_from_inserter_exports);
var import_element = require("@wordpress/element");
var import_hooks = require("@wordpress/hooks");
var POST_TYPES_ALLOWING_POST_CONTENT_TEMPLATE_PART = [
  "wp_block",
  "wp_template",
  "wp_template_part"
];
function useHideBlocksFromInserter(postType, mode) {
  (0, import_element.useEffect)(() => {
    (0, import_hooks.addFilter)(
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
    (0, import_hooks.addFilter)(
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
      (0, import_hooks.removeFilter)(
        "blockEditor.__unstableCanInsertBlockType",
        "removeTemplatePartsFromInserter"
      );
      (0, import_hooks.removeFilter)(
        "blockEditor.__unstableCanInsertBlockType",
        "removePostContentFromInserter"
      );
    };
  }, [postType, mode]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useHideBlocksFromInserter
});
//# sourceMappingURL=use-hide-blocks-from-inserter.cjs.map
