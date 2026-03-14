// packages/media-utils/src/utils/upload-media.ts
import { __, sprintf } from "@wordpress/i18n";
import { createBlobURL, revokeBlobURL } from "@wordpress/blob";
import { uploadToServer } from "./upload-to-server.mjs";
import { validateMimeType } from "./validate-mime-type.mjs";
import { validateMimeTypeForUser } from "./validate-mime-type-for-user.mjs";
import { validateFileSize } from "./validate-file-size.mjs";
import { UploadError } from "./upload-error.mjs";
function uploadMedia({
  wpAllowedMimeTypes,
  allowedTypes,
  additionalData = {},
  filesList,
  maxUploadFileSize,
  onError,
  onFileChange,
  signal,
  multiple = true
}) {
  if (!multiple && filesList.length > 1) {
    onError?.(new Error(__("Only one file can be used here.")));
    return;
  }
  const validFiles = [];
  const filesSet = [];
  const setAndUpdateFiles = (index, value) => {
    if (!window.__clientSideMediaProcessing) {
      if (filesSet[index]?.url) {
        revokeBlobURL(filesSet[index].url);
      }
    }
    filesSet[index] = value;
    onFileChange?.(
      filesSet.filter((attachment) => attachment !== null)
    );
  };
  for (const mediaFile of filesList) {
    try {
      validateMimeTypeForUser(mediaFile, wpAllowedMimeTypes);
    } catch (error) {
      onError?.(error);
      continue;
    }
    try {
      validateMimeType(mediaFile, allowedTypes);
    } catch (error) {
      onError?.(error);
      continue;
    }
    try {
      validateFileSize(mediaFile, maxUploadFileSize);
    } catch (error) {
      onError?.(error);
      continue;
    }
    validFiles.push(mediaFile);
    if (!window.__clientSideMediaProcessing) {
      filesSet.push({ url: createBlobURL(mediaFile) });
      onFileChange?.(filesSet);
    }
  }
  validFiles.map(async (file, index) => {
    try {
      const attachment = await uploadToServer(
        file,
        additionalData,
        signal
      );
      setAndUpdateFiles(index, attachment);
    } catch (error) {
      setAndUpdateFiles(index, null);
      let message;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = typeof error.message === "string" ? error.message : String(error.message);
      } else {
        message = sprintf(
          // translators: %s: file name
          __("Error while uploading file %s to the media library."),
          file.name
        );
      }
      onError?.(
        new UploadError({
          code: "GENERAL",
          message,
          file,
          cause: error instanceof Error ? error : void 0
        })
      );
    }
  });
}
export {
  uploadMedia
};
//# sourceMappingURL=upload-media.mjs.map
