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

// packages/editor/src/components/visual-editor/use-padding-appender.js
var use_padding_appender_exports = {};
__export(use_padding_appender_exports, {
  usePaddingAppender: () => usePaddingAppender
});
module.exports = __toCommonJS(use_padding_appender_exports);
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_block_editor = require("@wordpress/block-editor");
var import_blocks = require("@wordpress/blocks");
var CSS = ':root :where(.editor-styles-wrapper)::after {content: ""; display: block; height: 40vh;}';
function usePaddingAppender(enabled) {
  const registry = (0, import_data.useRegistry)();
  const effect = (0, import_compose.useRefEffect)(
    (node) => {
      function onMouseDown(event) {
        if (event.target !== node && // Tests for the parent element because in the iframed editor if the click is
        // below the padding the target will be the parent element (html) and should
        // still be treated as intent to append.
        event.target !== node.parentElement) {
          return;
        }
        const lastChild = node.lastElementChild;
        if (!lastChild) {
          return;
        }
        const lastChildRect = lastChild.getBoundingClientRect();
        if (event.clientY < lastChildRect.bottom) {
          return;
        }
        event.preventDefault();
        const blockOrder = registry.select(import_block_editor.store).getBlockOrder("");
        const lastBlockClientId = blockOrder[blockOrder.length - 1];
        const lastBlock = registry.select(import_block_editor.store).getBlock(lastBlockClientId);
        const { selectBlock, insertDefaultBlock } = registry.dispatch(import_block_editor.store);
        if (lastBlock && (0, import_blocks.isUnmodifiedDefaultBlock)(lastBlock)) {
          selectBlock(lastBlockClientId);
        } else {
          insertDefaultBlock();
        }
      }
      const { ownerDocument } = node;
      ownerDocument.addEventListener("pointerdown", onMouseDown);
      return () => {
        ownerDocument.removeEventListener("pointerdown", onMouseDown);
      };
    },
    [registry]
  );
  return enabled ? [effect, CSS] : [];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  usePaddingAppender
});
//# sourceMappingURL=use-padding-appender.cjs.map
