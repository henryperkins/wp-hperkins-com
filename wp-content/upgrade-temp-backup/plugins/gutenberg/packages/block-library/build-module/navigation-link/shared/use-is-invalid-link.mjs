// packages/block-library/src/navigation-link/shared/use-is-invalid-link.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useBlockEditingMode } from "@wordpress/block-editor";
var useIsInvalidLink = (kind, type, id, enabled) => {
  const isPostType = kind === "post-type" || type === "post" || type === "page";
  const hasId = Number.isInteger(id);
  const blockEditingMode = useBlockEditingMode();
  const { postStatus, isDeleted } = useSelect(
    (select) => {
      if (!isPostType) {
        return { postStatus: null, isDeleted: false };
      }
      if (blockEditingMode === "disabled" || !enabled) {
        return { postStatus: null, isDeleted: false };
      }
      const { getEntityRecord, hasFinishedResolution } = select(coreStore);
      const entityRecord = getEntityRecord("postType", type, id);
      const hasResolved = hasFinishedResolution("getEntityRecord", [
        "postType",
        type,
        id
      ]);
      const deleted = hasResolved && entityRecord === void 0;
      return {
        postStatus: entityRecord?.status,
        isDeleted: deleted
      };
    },
    [isPostType, blockEditingMode, enabled, type, id]
  );
  const isInvalid = isPostType && hasId && (isDeleted || postStatus && "trash" === postStatus);
  const isDraft = "draft" === postStatus;
  return [isInvalid, isDraft];
};
export {
  useIsInvalidLink
};
//# sourceMappingURL=use-is-invalid-link.mjs.map
