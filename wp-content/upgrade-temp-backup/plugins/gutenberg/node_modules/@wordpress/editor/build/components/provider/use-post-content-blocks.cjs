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

// packages/editor/src/components/provider/use-post-content-blocks.js
var use_post_content_blocks_exports = {};
__export(use_post_content_blocks_exports, {
  default: () => usePostContentBlocks
});
module.exports = __toCommonJS(use_post_content_blocks_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_hooks = require("@wordpress/hooks");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var POST_CONTENT_BLOCK_TYPES = [
  "core/post-title",
  "core/post-featured-image",
  "core/post-content"
];
function usePostContentBlocks() {
  const contentOnlyBlockTypes = (0, import_element.useMemo)(
    () => [
      ...(0, import_hooks.applyFilters)(
        "editor.postContentBlockTypes",
        POST_CONTENT_BLOCK_TYPES
      )
    ],
    []
  );
  const contentOnlyIds = (0, import_data.useSelect)(
    (select) => {
      const { getPostBlocksByName } = (0, import_lock_unlock.unlock)(select(import_store.store));
      return getPostBlocksByName(contentOnlyBlockTypes);
    },
    [contentOnlyBlockTypes]
  );
  return contentOnlyIds;
}
//# sourceMappingURL=use-post-content-blocks.cjs.map
