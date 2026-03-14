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

// packages/block-library/src/navigation/edit/use-create-overlay.js
var use_create_overlay_exports = {};
__export(use_create_overlay_exports, {
  default: () => useCreateOverlayTemplatePart
});
module.exports = __toCommonJS(use_create_overlay_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_utils = require("./utils.cjs");
var import_constants = require("../constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
function useCreateOverlayTemplatePart(overlayTemplateParts) {
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const pattern = (0, import_data.useSelect)(
    (select) => (0, import_lock_unlock.unlock)(select(import_block_editor.store)).getPatternBySlug(
      "core/navigation-overlay"
    ),
    []
  );
  const createOverlayTemplatePart = (0, import_element.useCallback)(async () => {
    const templatePartsWithTitles = overlayTemplateParts.filter(
      (templatePart2) => templatePart2.title?.rendered
    );
    const uniqueTitle = (0, import_utils.getUniqueTemplatePartTitle)(
      (0, import_i18n.__)("Navigation Overlay"),
      templatePartsWithTitles
    );
    const cleanSlug = (0, import_utils.getCleanTemplatePartSlug)(uniqueTitle);
    let initialContent = "";
    if (pattern?.content) {
      const blocks = (0, import_blocks.parse)(pattern.content, {
        __unstableSkipMigrationLogs: true
      });
      initialContent = (0, import_blocks.serialize)(blocks);
    } else {
      initialContent = (0, import_blocks.serialize)([(0, import_blocks.createBlock)("core/paragraph")]);
    }
    const templatePart = await saveEntityRecord(
      "postType",
      "wp_template_part",
      {
        slug: cleanSlug,
        title: uniqueTitle,
        content: initialContent,
        area: import_constants.NAVIGATION_OVERLAY_TEMPLATE_PART_AREA
      },
      { throwOnError: true }
    );
    return templatePart;
  }, [overlayTemplateParts, saveEntityRecord, pattern]);
  return createOverlayTemplatePart;
}
//# sourceMappingURL=use-create-overlay.cjs.map
