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

// packages/editor/src/components/document-bar/useEditedSectionDetails.js
var useEditedSectionDetails_exports = {};
__export(useEditedSectionDetails_exports, {
  default: () => useEditedSectionDetails
});
module.exports = __toCommonJS(useEditedSectionDetails_exports);
var import_data = require("@wordpress/data");
var import_html_entities = require("@wordpress/html-entities");
var import_block_editor = require("@wordpress/block-editor");
var import_core_data = require("@wordpress/core-data");
var import_lock_unlock = require("../../lock-unlock.cjs");
function useEditedSectionDetails() {
  return (0, import_data.useSelect)((select) => {
    const {
      getBlockAttributes,
      getBlockName,
      __experimentalGetParsedPattern
    } = select(import_block_editor.store);
    const { getEditedEntityRecord, getCurrentTheme } = select(import_core_data.store);
    const { getEditedContentOnlySection } = (0, import_lock_unlock.unlock)(
      select(import_block_editor.store)
    );
    const editedSectionId = getEditedContentOnlySection();
    if (!editedSectionId) {
      return null;
    }
    const attributes = getBlockAttributes(editedSectionId);
    const patternName = attributes?.metadata?.patternName;
    if (patternName) {
      const pattern = typeof __experimentalGetParsedPattern === "function" ? __experimentalGetParsedPattern(patternName) : null;
      return {
        patternName,
        patternTitle: pattern?.title || attributes?.metadata?.name,
        type: "pattern"
      };
    }
    const blockName = getBlockName(editedSectionId);
    if (blockName === "core/block" && !!attributes?.ref) {
      const entity = getEditedEntityRecord(
        "postType",
        "wp_block",
        attributes.ref
      );
      if (entity?.title) {
        return {
          patternName: attributes.ref,
          patternTitle: (0, import_html_entities.decodeEntities)(entity.title),
          type: "synced-pattern"
        };
      }
    }
    if (blockName === "core/template-part" && !!attributes?.slug) {
      const theme = attributes.theme || getCurrentTheme()?.stylesheet;
      const templatePartId = theme ? `${theme}//${attributes.slug}` : null;
      if (templatePartId) {
        const entity = getEditedEntityRecord(
          "postType",
          "wp_template_part",
          templatePartId
        );
        if (entity?.title) {
          return {
            patternName: attributes.slug,
            patternTitle: (0, import_html_entities.decodeEntities)(entity.title),
            type: "template-part"
          };
        }
      }
    }
    return null;
  }, []);
}
//# sourceMappingURL=useEditedSectionDetails.cjs.map
