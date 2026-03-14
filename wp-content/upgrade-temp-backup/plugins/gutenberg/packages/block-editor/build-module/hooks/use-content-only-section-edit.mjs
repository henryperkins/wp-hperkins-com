// packages/block-editor/src/hooks/use-content-only-section-edit.js
import { useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "../store/index.mjs";
import { unlock } from "../lock-unlock.mjs";
function useContentOnlySectionEdit(clientId) {
  const {
    isSectionBlock,
    isWithinSection,
    isWithinEditedSection,
    isEditingContentOnlySection,
    editedContentOnlySection
  } = useSelect(
    (select) => {
      const {
        isSectionBlock: _isSectionBlock,
        getParentSectionBlock,
        getEditedContentOnlySection,
        isWithinEditedContentOnlySection
      } = unlock(select(blockEditorStore));
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
  const blockEditorActions = useDispatch(blockEditorStore);
  const { editContentOnlySection, stopEditingContentOnlySection } = unlock(blockEditorActions);
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
export {
  useContentOnlySectionEdit as default
};
//# sourceMappingURL=use-content-only-section-edit.mjs.map
