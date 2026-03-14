// packages/editor/src/utils/media-upload/index.js
import { v4 as uuid } from "uuid";
import { select, dispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { uploadMedia } from "@wordpress/media-utils";
import { store as editorStore } from "../../store/index.mjs";
var noop = () => {
};
function mediaUpload({
  additionalData = {},
  allowedTypes,
  filesList,
  maxUploadFileSize,
  onError = noop,
  onFileChange,
  onSuccess,
  multiple = true
}) {
  const { receiveEntityRecords } = dispatch(coreDataStore);
  const { getCurrentPost, getEditorSettings } = select(editorStore);
  const {
    lockPostAutosaving,
    unlockPostAutosaving,
    lockPostSaving,
    unlockPostSaving
  } = dispatch(editorStore);
  const wpAllowedMimeTypes = getEditorSettings().allowedMimeTypes;
  const lockKey = `image-upload-${uuid()}`;
  let imageIsUploading = false;
  maxUploadFileSize = maxUploadFileSize || getEditorSettings().maxUploadFileSize;
  const currentPost = getCurrentPost();
  const currentPostId = typeof currentPost?.id === "number" ? currentPost.id : currentPost?.wp_id;
  const setSaveLock = () => {
    if (window.__clientSideMediaProcessing) {
      return;
    }
    lockPostSaving(lockKey);
    lockPostAutosaving(lockKey);
    imageIsUploading = true;
  };
  const postData = currentPostId ? { post: currentPostId } : {};
  const clearSaveLock = () => {
    if (window.__clientSideMediaProcessing) {
      return;
    }
    unlockPostSaving(lockKey);
    unlockPostAutosaving(lockKey);
    imageIsUploading = false;
  };
  uploadMedia({
    allowedTypes,
    filesList,
    onFileChange: (file) => {
      if (!window.__clientSideMediaProcessing) {
        if (!imageIsUploading) {
          setSaveLock();
        } else {
          clearSaveLock();
        }
      }
      onFileChange?.(file);
      const entityFiles = file.filter((_file) => _file?.id);
      if (entityFiles?.length) {
        const invalidateCache = true;
        receiveEntityRecords(
          "postType",
          "attachment",
          entityFiles,
          void 0,
          invalidateCache
        );
      }
    },
    onSuccess,
    additionalData: {
      ...postData,
      ...additionalData
    },
    maxUploadFileSize,
    onError: ({ message }) => {
      if (!window.__clientSideMediaProcessing) {
        clearSaveLock();
      }
      onError(message);
    },
    wpAllowedMimeTypes,
    multiple
  });
}
export {
  mediaUpload as default
};
//# sourceMappingURL=index.mjs.map
