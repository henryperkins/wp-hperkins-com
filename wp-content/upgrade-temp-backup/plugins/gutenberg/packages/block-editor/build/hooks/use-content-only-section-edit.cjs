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

// packages/block-editor/src/hooks/use-content-only-section-edit.js
var use_content_only_section_edit_exports = {};
__export(use_content_only_section_edit_exports, {
  default: () => useContentOnlySectionEdit
});
module.exports = __toCommonJS(use_content_only_section_edit_exports);
var import_data = require("@wordpress/data");
var import_store = require("../store/index.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
function useContentOnlySectionEdit(clientId) {
  const {
    isSectionBlock,
    isWithinSection,
    isWithinEditedSection,
    isEditingContentOnlySection,
    editedContentOnlySection
  } = (0, import_data.useSelect)(
    (select) => {
      const {
        isSectionBlock: _isSectionBlock,
        getParentSectionBlock,
        getEditedContentOnlySection,
        isWithinEditedContentOnlySection
      } = (0, import_lock_unlock.unlock)(select(import_store.store));
      const editedSection = getEditedContentOnlySection();
      return {
        isSectionBlock: _isSectionBlock(clientId),
        isWithinSection: _isSectionBlock(clientId) || !!getParentSectionBlock(clientId),
        isWithinEditedSection: isWithinEditedContentOnlySection(clientId),
        isEditingContentOnlySection: editedSection === clientId,
        editedContentOnlySection: editedSection
      };
    },
    [clientId]
  );
  const blockEditorActions = (0, import_data.useDispatch)(import_store.store);
  const { editContentOnlySection, stopEditingContentOnlySection } = (0, import_lock_unlock.unlock)(blockEditorActions);
  return {
    isSectionBlock,
    isWithinSection,
    isWithinEditedSection,
    isEditingContentOnlySection,
    editedContentOnlySection,
    editContentOnlySection,
    stopEditingContentOnlySection
  };
}
//# sourceMappingURL=use-content-only-section-edit.cjs.map
