// packages/block-library/src/navigation/edit/use-create-overlay.js
import { useCallback } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { parse, serialize, createBlock } from "@wordpress/blocks";
import { getUniqueTemplatePartTitle, getCleanTemplatePartSlug } from "./utils.mjs";
import { NAVIGATION_OVERLAY_TEMPLATE_PART_AREA } from "../constants.mjs";
import { unlock } from "../../lock-unlock.mjs";
function useCreateOverlayTemplatePart(overlayTemplateParts) {
  const { saveEntityRecord } = useDispatch(coreStore);
  const pattern = useSelect(
    (select) => unlock(select(blockEditorStore)).getPatternBySlug(
      "core/navigation-overlay"
    ),
    []
  );
  const createOverlayTemplatePart = useCallback(async () => {
    const templatePartsWithTitles = overlayTemplateParts.filter(
      (templatePart2) => templatePart2.title?.rendered
    );
    const uniqueTitle = getUniqueTemplatePartTitle(
      __("Navigation Overlay"),
      templatePartsWithTitles
    );
    const cleanSlug = getCleanTemplatePartSlug(uniqueTitle);
    let initialContent = "";
    if (pattern?.content) {
      const blocks = parse(pattern.content, {
        __unstableSkipMigrationLogs: true
      });
      initialContent = serialize(blocks);
    } else {
      initialContent = serialize([createBlock("core/paragraph")]);
    }
    const templatePart = await saveEntityRecord(
      "postType",
      "wp_template_part",
      {
        slug: cleanSlug,
        title: uniqueTitle,
        content: initialContent,
        area: NAVIGATION_OVERLAY_TEMPLATE_PART_AREA
      },
      { throwOnError: true }
    );
    return templatePart;
  }, [overlayTemplateParts, saveEntityRecord, pattern]);
  return createOverlayTemplatePart;
}
export {
  useCreateOverlayTemplatePart as default
};
//# sourceMappingURL=use-create-overlay.mjs.map
