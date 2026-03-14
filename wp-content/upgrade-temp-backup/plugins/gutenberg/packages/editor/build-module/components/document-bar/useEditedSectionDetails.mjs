// packages/editor/src/components/document-bar/useEditedSectionDetails.js
import { useSelect } from "@wordpress/data";
import { decodeEntities } from "@wordpress/html-entities";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { unlock } from "../../lock-unlock.mjs";
function useEditedSectionDetails() {
  return useSelect((select) => {
    const {
      getBlockAttributes,
      getBlockName,
      __experimentalGetParsedPattern
    } = select(blockEditorStore);
    const { getEditedEntityRecord, getCurrentTheme } = select(coreStore);
    const { getEditedContentOnlySection } = unlock(
      select(blockEditorStore)
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
          patternTitle: decodeEntities(entity.title),
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
            patternTitle: decodeEntities(entity.title),
            type: "template-part"
          };
        }
      }
    }
    return null;
  }, []);
}
export {
  useEditedSectionDetails as default
};
//# sourceMappingURL=useEditedSectionDetails.mjs.map
