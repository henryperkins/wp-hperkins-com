// packages/block-library/src/utils/is-within-overlay.js
import { select } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { NAVIGATION_OVERLAY_TEMPLATE_PART_AREA } from "../navigation/constants.mjs";
function isWithinNavigationOverlay() {
  const editorStore = select("core/editor");
  if (!editorStore) {
    return false;
  }
  const { getCurrentPostType, getCurrentPostId } = editorStore;
  const { getEditedEntityRecord } = select(coreStore);
  const postType = getCurrentPostType?.();
  const postId = getCurrentPostId?.();
  if (postType === "wp_template_part" && postId) {
    const templatePart = getEditedEntityRecord(
      "postType",
      "wp_template_part",
      postId
    );
    return templatePart?.area === NAVIGATION_OVERLAY_TEMPLATE_PART_AREA;
  }
  return false;
}
export {
  isWithinNavigationOverlay
};
//# sourceMappingURL=is-within-overlay.mjs.map
