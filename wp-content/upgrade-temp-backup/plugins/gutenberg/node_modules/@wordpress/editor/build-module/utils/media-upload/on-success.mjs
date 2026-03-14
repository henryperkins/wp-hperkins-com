// packages/editor/src/utils/media-upload/on-success.js
import { dispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
function mediaUploadOnSuccess(attachments) {
  const { invalidateResolution } = dispatch(coreDataStore);
  for (const attachment of attachments) {
    if (attachment.id) {
      invalidateResolution("getEntityRecord", [
        "postType",
        "attachment",
        attachment.id,
        { context: "view" }
      ]);
      invalidateResolution("getEntityRecord", [
        "postType",
        "attachment",
        attachment.id
      ]);
    }
  }
}
export {
  mediaUploadOnSuccess as default
};
//# sourceMappingURL=on-success.mjs.map
