// packages/block-editor/src/components/block-inspector/edit-contents.js
import { Button, __experimentalVStack as VStack } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { isReusableBlock, isTemplatePart } from "@wordpress/blocks";
import useContentOnlySectionEdit from "../../hooks/use-content-only-section-edit.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function IsolatedEditButton({
  block,
  onNavigateToEntityRecord,
  isSyncedPattern,
  isTemplatePartBlock
}) {
  const blockAttributes = block?.attributes || {};
  const handleClick = () => {
    if (isSyncedPattern) {
      onNavigateToEntityRecord({
        postId: blockAttributes.ref,
        postType: "wp_block"
      });
    } else if (isTemplatePartBlock) {
      const { theme, slug } = blockAttributes;
      const templatePartId = theme && slug ? `${theme}//${slug}` : null;
      if (templatePartId) {
        onNavigateToEntityRecord({
          postId: templatePartId,
          postType: "wp_template_part"
        });
      }
    }
  };
  return /* @__PURE__ */ jsx(VStack, { className: "block-editor-block-inspector-edit-contents", expanded: true, children: /* @__PURE__ */ jsx(
    Button,
    {
      className: "block-editor-block-inspector-edit-contents__button",
      __next40pxDefaultSize: true,
      variant: "secondary",
      onClick: handleClick,
      children: __("Edit original")
    }
  ) });
}
function InlineEditButton({
  clientId,
  editedContentOnlySection,
  editContentOnlySection,
  stopEditingContentOnlySection
}) {
  const handleClick = () => {
    if (!editedContentOnlySection) {
      editContentOnlySection(clientId);
    } else {
      stopEditingContentOnlySection();
    }
  };
  return /* @__PURE__ */ jsx(VStack, { className: "block-editor-block-inspector-edit-contents", expanded: true, children: /* @__PURE__ */ jsx(
    Button,
    {
      className: "block-editor-block-inspector-edit-contents__button",
      __next40pxDefaultSize: true,
      variant: "secondary",
      onClick: handleClick,
      children: editedContentOnlySection ? __("Exit pattern") : __("Edit pattern")
    }
  ) });
}
function EditContents({ clientId }) {
  const {
    isWithinSection,
    isWithinEditedSection,
    editedContentOnlySection,
    editContentOnlySection,
    stopEditingContentOnlySection
  } = useContentOnlySectionEdit(clientId);
  const { block, onNavigateToEntityRecord } = useSelect(
    (select) => {
      const { getBlock, getSettings } = select(blockEditorStore);
      return {
        block: getBlock(clientId),
        onNavigateToEntityRecord: getSettings().onNavigateToEntityRecord
      };
    },
    [clientId]
  );
  if (!isWithinSection && !isWithinEditedSection) {
    return null;
  }
  const isSyncedPattern = isReusableBlock(block);
  const isTemplatePartBlock = isTemplatePart(block);
  const shouldUseIsolatedEditor = (isSyncedPattern || isTemplatePartBlock) && onNavigateToEntityRecord;
  if (shouldUseIsolatedEditor) {
    return /* @__PURE__ */ jsx(
      IsolatedEditButton,
      {
        block,
        onNavigateToEntityRecord,
        isSyncedPattern,
        isTemplatePartBlock
      }
    );
  }
  return /* @__PURE__ */ jsx(
    InlineEditButton,
    {
      clientId,
      editedContentOnlySection,
      editContentOnlySection,
      stopEditingContentOnlySection
    }
  );
}
export {
  EditContents as default
};
//# sourceMappingURL=edit-contents.mjs.map
