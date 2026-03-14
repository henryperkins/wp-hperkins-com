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

// packages/editor/src/components/block-removal-warnings/index.js
var block_removal_warnings_exports = {};
__export(block_removal_warnings_exports, {
  default: () => BlockRemovalWarnings
});
module.exports = __toCommonJS(block_removal_warnings_exports);
var import_i18n = require("@wordpress/i18n");
var import_block_editor = require("@wordpress/block-editor");
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { BlockRemovalWarningModal } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var TEMPLATE_BLOCKS = [
  "core/post-content",
  "core/post-template",
  "core/query"
];
var BLOCK_REMOVAL_RULES = [
  {
    // Template blocks.
    // The warning is only shown when a user manipulates templates or template parts.
    postTypes: ["wp_template", "wp_template_part"],
    callback(removedBlocks) {
      const removedPostContentBlocks = removedBlocks.filter(
        ({ name }) => name === "core/post-content"
      );
      if (removedPostContentBlocks.length) {
        return {
          description: (0, import_i18n.__)(
            "This block displays the content of posts and pages using this template."
          ),
          warning: (0, import_i18n.__)(
            "If you delete it, posts or pages using this template will not display any content."
          ),
          subtext: (0, import_i18n.__)("Visitors will see blank pages."),
          requireConfirmation: true
        };
      }
      const removedTemplateBlocks = removedBlocks.filter(
        ({ name }) => TEMPLATE_BLOCKS.includes(name)
      );
      if (removedTemplateBlocks.length) {
        return (0, import_i18n._n)(
          "Deleting this block will stop your post or page content from displaying on this template. It is not recommended.",
          "Some of the deleted blocks will stop your post or page content from displaying on this template. It is not recommended.",
          removedBlocks.length
        );
      }
    }
  },
  {
    // Pattern overrides.
    // The warning is only shown when the user edits a pattern.
    postTypes: ["wp_block"],
    callback(removedBlocks) {
      const removedBlocksWithOverrides = removedBlocks.filter(
        ({ attributes }) => attributes?.metadata?.bindings && Object.values(attributes.metadata.bindings).some(
          (binding) => binding.source === "core/pattern-overrides"
        )
      );
      if (removedBlocksWithOverrides.length) {
        return (0, import_i18n._n)(
          "The deleted block allows instance overrides. Removing it may result in content not displaying where this pattern is used. Are you sure you want to proceed?",
          "Some of the deleted blocks allow instance overrides. Removing them may result in content not displaying where this pattern is used. Are you sure you want to proceed?",
          removedBlocks.length
        );
      }
    }
  }
];
function BlockRemovalWarnings() {
  const currentPostType = (0, import_data.useSelect)(
    (select) => select(import_store.store).getCurrentPostType(),
    []
  );
  const removalRulesForPostType = (0, import_element.useMemo)(
    () => BLOCK_REMOVAL_RULES.filter(
      (rule) => rule.postTypes.includes(currentPostType)
    ),
    [currentPostType]
  );
  if (!BlockRemovalWarningModal) {
    return null;
  }
  if (!removalRulesForPostType) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockRemovalWarningModal, { rules: removalRulesForPostType });
}
//# sourceMappingURL=index.cjs.map
