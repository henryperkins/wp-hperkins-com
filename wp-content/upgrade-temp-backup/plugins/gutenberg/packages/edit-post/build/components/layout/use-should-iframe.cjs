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

// packages/edit-post/src/components/layout/use-should-iframe.js
var use_should_iframe_exports = {};
__export(use_should_iframe_exports, {
  useShouldIframe: () => useShouldIframe
});
module.exports = __toCommonJS(use_should_iframe_exports);
var import_editor = require("@wordpress/editor");
var import_data = require("@wordpress/data");
var import_blocks = require("@wordpress/blocks");
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var isGutenbergPlugin = globalThis.IS_GUTENBERG_PLUGIN ? true : false;
function useShouldIframe() {
  return (0, import_data.useSelect)((select) => {
    const { getCurrentPostType, getDeviceType } = select(import_editor.store);
    const { getClientIdsWithDescendants, getBlockName } = select(import_block_editor.store);
    const { getBlockType } = select(import_blocks.store);
    return (
      // If the Gutenberg plugin is active, we ALWAYS use the iframe for
      // consistency across the post and site editor. We plan on enforcing
      // the iframe in the future, so Gutenberg both serves as way for us
      // to warn plugin developers and for plugin developers to test their
      // blocks easily. Before GB v22.5, we only enforced it for
      // block-based themes (classic themes used the same rules as core).
      isGutenbergPlugin || // We also still want to iframe all the special
      // editor features and modes such as device previews, zoom out, and
      // template/pattern editing.
      getDeviceType() !== "Desktop" || ["wp_template", "wp_block"].includes(getCurrentPostType()) || (0, import_lock_unlock.unlock)(select(import_block_editor.store)).isZoomOut() || // Finally, still iframe the editor if all present blocks are v3
      // (which means they are marked as iframe-compatible).
      [...new Set(getClientIdsWithDescendants().map(getBlockName))].map(getBlockType).filter(Boolean).every((blockType) => blockType.apiVersion >= 3)
    );
  }, []);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useShouldIframe
});
//# sourceMappingURL=use-should-iframe.cjs.map
