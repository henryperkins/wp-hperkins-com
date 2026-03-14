// packages/block-editor/src/components/block-toolbar/edit-section-button.js
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { isReusableBlock, isTemplatePart } from "@wordpress/blocks";
import { store as blockEditorStore } from "../../store/index.mjs";
import useContentOnlySectionEdit from "../../hooks/use-content-only-section-edit.mjs";
import { jsx } from "react/jsx-runtime";
function EditSectionButton({ clientId }) {
  const {
    isSectionBlock,
    isEditingContentOnlySection,
    editContentOnlySection,
    stopEditingContentOnlySection
  } = useContentOnlySectionEdit(clientId);
  const blockType = useSelect(
    (select) => {
      if (!clientId) {
        return null;
      }
      const { getBlockName } = select(blockEditorStore);
      const blockName = getBlockName(clientId);
      return blockName ? { name: blockName } : null;
    },
    [clientId]
  );
  if (!clientId || !isSectionBlock && !isEditingContentOnlySection || isReusableBlock(blockType) || isTemplatePart(blockType)) {
    return null;
  }
  const isEditing = isEditingContentOnlySection;
  const handleClick = () => {
    if (isEditing) {
      stopEditingContentOnlySection();
    } else {
      editContentOnlySection(clientId);
    }
  };
  return /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(ToolbarButton, { onClick: handleClick, children: isEditing ? __("Exit pattern") : __("Edit pattern") }) });
}
export {
  EditSectionButton as default
};
//# sourceMappingURL=edit-section-button.mjs.map
