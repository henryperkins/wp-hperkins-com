// packages/upload-media/src/store/actions.ts
import { v4 as uuidv4 } from "uuid";
import { Type } from "./types.mjs";
import { vipsCancelOperations } from "./utils/index.mjs";
import { validateMimeType } from "../validate-mime-type.mjs";
import { validateMimeTypeForUser } from "../validate-mime-type-for-user.mjs";
import { validateFileSize } from "../validate-file-size.mjs";
function addItems({
  files,
  onChange,
  onSuccess,
  onError,
  onBatchSuccess,
  additionalData,
  allowedTypes
}) {
  return async ({ select, dispatch }) => {
    const batchId = uuidv4();
    for (const file of files) {
      try {
        validateMimeType(file, allowedTypes);
        validateMimeTypeForUser(
          file,
          select.getSettings().allowedMimeTypes
        );
      } catch (error) {
        onError?.(error);
        continue;
      }
      try {
        validateFileSize(
          file,
          select.getSettings().maxUploadFileSize
        );
      } catch (error) {
        onError?.(error);
        continue;
      }
      dispatch.addItem({
        file,
        batchId,
        onChange,
        onSuccess,
        onBatchSuccess,
        onError,
        additionalData
      });
    }
  };
}
function cancelItem(id, error, silent = false) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    item.abortController?.abort();
    await vipsCancelOperations(id);
    if (!silent) {
      const { onError } = item;
      onError?.(error ?? new Error("Upload cancelled"));
      if (!onError && error) {
        console.error("Upload cancelled", error);
      }
    }
    dispatch({
      type: Type.Cancel,
      id,
      error
    });
    dispatch.removeItem(id);
    dispatch.revokeBlobUrls(id);
    if (item.batchId && select.isBatchUploaded(item.batchId)) {
      item.onBatchSuccess?.();
    }
  };
}
function retryItem(id) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    if (!item.error) {
      return;
    }
    dispatch({
      type: Type.RetryItem,
      id
    });
    dispatch.processItem(id);
  };
}
export {
  addItems,
  cancelItem,
  retryItem
};
//# sourceMappingURL=actions.mjs.map
