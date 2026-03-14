// packages/upload-media/src/store/private-actions.ts
import { v4 as uuidv4 } from "uuid";
import { createBlobURL, isBlobURL, revokeBlobURL } from "@wordpress/blob";
import { cloneFile, convertBlobToFile, renameFile } from "../utils.mjs";
import { CLIENT_SIDE_SUPPORTED_MIME_TYPES } from "./constants.mjs";
import { StubFile } from "../stub-file.mjs";
import { UploadError } from "../upload-error.mjs";
import {
  vipsResizeImage,
  vipsRotateImage,
  vipsConvertImageFormat,
  vipsHasTransparency,
  terminateVipsWorker
} from "./utils/index.mjs";
import { ItemStatus, OperationType, Type } from "./types.mjs";
var DEFAULT_OUTPUT_QUALITY = 0.82;
function shouldPauseForSideload(item, operation, select) {
  if (operation !== OperationType.Upload || !item.parentId || !item.additionalData.post) {
    return false;
  }
  return select.isUploadingToPost(item.additionalData.post);
}
function addItem({
  file: fileOrBlob,
  batchId,
  onChange,
  onSuccess,
  onBatchSuccess,
  onError,
  additionalData = {},
  sourceUrl,
  sourceAttachmentId,
  abortController,
  operations
}) {
  return async ({ dispatch }) => {
    const itemId = uuidv4();
    const file = convertBlobToFile(fileOrBlob);
    let blobUrl;
    if (!(file instanceof StubFile)) {
      blobUrl = createBlobURL(file);
      dispatch({
        type: Type.CacheBlobUrl,
        id: itemId,
        blobUrl
      });
    }
    dispatch({
      type: Type.Add,
      item: {
        id: itemId,
        batchId,
        status: ItemStatus.Processing,
        sourceFile: cloneFile(file),
        file,
        attachment: {
          url: blobUrl
        },
        additionalData: {
          convert_format: false,
          generate_sub_sizes: false,
          ...additionalData
        },
        onChange,
        onSuccess,
        onBatchSuccess,
        onError,
        sourceUrl,
        sourceAttachmentId,
        abortController: abortController || new AbortController(),
        operations: Array.isArray(operations) ? operations : [OperationType.Prepare]
      }
    });
    dispatch.processItem(itemId);
  };
}
function addSideloadItem({
  file,
  onChange,
  additionalData,
  operations,
  batchId,
  parentId
}) {
  return ({ dispatch }) => {
    const itemId = uuidv4();
    dispatch({
      type: Type.Add,
      item: {
        id: itemId,
        batchId,
        status: ItemStatus.Processing,
        sourceFile: cloneFile(file),
        file,
        onChange,
        additionalData: {
          ...additionalData
        },
        parentId,
        operations: Array.isArray(operations) ? operations : [OperationType.Prepare],
        abortController: new AbortController()
      }
    });
    dispatch.processItem(itemId);
  };
}
function processItem(id) {
  return async ({ select, dispatch }) => {
    if (select.isPaused()) {
      return;
    }
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    const {
      attachment,
      onChange,
      onSuccess,
      onBatchSuccess,
      batchId,
      parentId
    } = item;
    const operation = Array.isArray(item.operations?.[0]) ? item.operations[0][0] : item.operations?.[0];
    const operationArgs = Array.isArray(item.operations?.[0]) ? item.operations[0][1] : void 0;
    if (shouldPauseForSideload(item, operation, select)) {
      dispatch({
        type: Type.PauseItem,
        id
      });
      return;
    }
    if (operation === OperationType.Upload) {
      const settings = select.getSettings();
      const activeCount = select.getActiveUploadCount();
      if (activeCount >= settings.maxConcurrentUploads) {
        return;
      }
    }
    if (operation === OperationType.ResizeCrop || operation === OperationType.Rotate) {
      const settings = select.getSettings();
      const activeCount = select.getActiveImageProcessingCount();
      if (activeCount >= settings.maxConcurrentImageProcessing) {
        return;
      }
    }
    if (attachment) {
      onChange?.([attachment]);
    }
    if (!operation) {
      if (parentId || !parentId && !select.hasPendingItemsByParentId(id)) {
        if (attachment) {
          onSuccess?.([attachment]);
        }
        dispatch.removeItem(id);
        dispatch.revokeBlobUrls(id);
        if (batchId && select.isBatchUploaded(batchId)) {
          onBatchSuccess?.();
        }
      }
      if (parentId && batchId && select.isBatchUploaded(batchId)) {
        const parentItem = select.getItem(parentId);
        if (!parentItem) {
          return;
        }
        if (attachment) {
          parentItem.onSuccess?.([attachment]);
        }
        dispatch.removeItem(parentId);
        dispatch.revokeBlobUrls(parentId);
        if (parentItem.batchId && select.isBatchUploaded(parentItem.batchId)) {
          parentItem.onBatchSuccess?.();
        }
      }
      return;
    }
    dispatch({
      type: Type.OperationStart,
      id,
      operation
    });
    switch (operation) {
      case OperationType.Prepare:
        dispatch.prepareItem(item.id);
        break;
      case OperationType.ResizeCrop:
        dispatch.resizeCropItem(
          item.id,
          operationArgs
        );
        break;
      case OperationType.Rotate:
        dispatch.rotateItem(
          item.id,
          operationArgs
        );
        break;
      case OperationType.TranscodeImage:
        dispatch.transcodeImageItem(
          item.id,
          operationArgs
        );
        break;
      case OperationType.Upload:
        if (item.parentId) {
          dispatch.sideloadItem(id);
        } else {
          dispatch.uploadItem(id);
        }
        break;
      case OperationType.ThumbnailGeneration:
        dispatch.generateThumbnails(id);
        break;
    }
  };
}
function pauseQueue() {
  return {
    type: Type.PauseQueue
  };
}
function resumeQueue() {
  return async ({ select, dispatch }) => {
    dispatch({
      type: Type.ResumeQueue
    });
    for (const item of select.getAllItems()) {
      dispatch.processItem(item.id);
    }
  };
}
function pauseItem(id) {
  return async ({ dispatch }) => {
    dispatch({
      type: Type.PauseItem,
      id
    });
  };
}
function resumeItemByPostId(postOrAttachmentId) {
  return async ({ select, dispatch }) => {
    const item = select.getPausedUploadForPost(postOrAttachmentId);
    if (item) {
      dispatch({
        type: Type.ResumeItem,
        id: item.id
      });
      dispatch.processItem(item.id);
    }
  };
}
function removeItem(id) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    dispatch({
      type: Type.Remove,
      id
    });
    if (select.getAllItems().length === 0) {
      terminateVipsWorker();
    }
  };
}
function finishOperation(id, updates) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    const previousOperation = item?.currentOperation;
    dispatch({
      type: Type.OperationFinish,
      id,
      item: updates
    });
    dispatch.processItem(id);
    if (previousOperation === OperationType.Upload) {
      const pendingUploads = select.getPendingUploads();
      for (const pendingItem of pendingUploads) {
        dispatch.processItem(pendingItem.id);
      }
    }
    if (previousOperation === OperationType.ResizeCrop || previousOperation === OperationType.Rotate) {
      const pendingItems = select.getPendingImageProcessing();
      for (const pendingItem of pendingItems) {
        dispatch.processItem(pendingItem.id);
      }
    }
  };
}
var VALID_IMAGE_FORMATS = ["jpeg", "webp", "avif", "png", "gif"];
function isValidImageFormat(format) {
  return VALID_IMAGE_FORMATS.includes(format);
}
function getInterlacedSetting(outputMimeType, settings) {
  switch (outputMimeType) {
    case "image/jpeg":
      return settings.jpegInterlaced ?? false;
    case "image/png":
      return settings.pngInterlaced ?? false;
    case "image/gif":
      return settings.gifInterlaced ?? false;
    default:
      return false;
  }
}
async function getTranscodeImageOperation(file, outputMimeType, settings) {
  if (file.type === "image/png" && outputMimeType === "image/jpeg") {
    const blobUrl = createBlobURL(file);
    try {
      const hasAlpha = await vipsHasTransparency(blobUrl);
      if (hasAlpha) {
        return null;
      }
    } catch {
      return null;
    } finally {
      revokeBlobURL(blobUrl);
    }
  }
  const formatPart = outputMimeType.split("/")[1];
  if (!isValidImageFormat(formatPart)) {
    return null;
  }
  return [
    OperationType.TranscodeImage,
    {
      outputFormat: formatPart,
      outputQuality: DEFAULT_OUTPUT_QUALITY,
      interlaced: getInterlacedSetting(outputMimeType, settings)
    }
  ];
}
function prepareItem(id) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    const { file } = item;
    const operations = [];
    const settings = select.getSettings();
    const isImage = file.type.startsWith("image/");
    const isVipsSupported = CLIENT_SIDE_SUPPORTED_MIME_TYPES.includes(
      file.type
    );
    if (isImage && isVipsSupported) {
      const { imageOutputFormats } = settings;
      const outputMimeType = imageOutputFormats?.[file.type];
      if (outputMimeType && outputMimeType !== file.type) {
        const transcodeOperation = await getTranscodeImageOperation(
          file,
          outputMimeType,
          settings
        );
        if (transcodeOperation) {
          operations.push(transcodeOperation);
        }
      }
      operations.push(
        OperationType.Upload,
        OperationType.ThumbnailGeneration
      );
    } else {
      operations.push(OperationType.Upload);
    }
    dispatch({
      type: Type.AddOperations,
      id,
      operations
    });
    const updates = !isVipsSupported || !isImage ? {
      additionalData: {
        ...item.additionalData,
        generate_sub_sizes: true
      }
    } : {};
    dispatch.finishOperation(id, updates);
  };
}
function uploadItem(id) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    select.getSettings().mediaUpload({
      filesList: [item.file],
      additionalData: item.additionalData,
      signal: item.abortController?.signal,
      onFileChange: ([attachment]) => {
        if (!isBlobURL(attachment.url)) {
          dispatch.finishOperation(id, {
            attachment
          });
        }
      },
      onSuccess: ([attachment]) => {
        dispatch.finishOperation(id, {
          attachment
        });
      },
      onError: (error) => {
        dispatch.cancelItem(id, error);
      }
    });
  };
}
function sideloadItem(id) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    const { post, ...additionalData } = item.additionalData;
    const mediaSideload = select.getSettings().mediaSideload;
    if (!mediaSideload) {
      dispatch.finishOperation(id, {});
      return;
    }
    mediaSideload({
      file: item.file,
      attachmentId: post,
      additionalData,
      signal: item.abortController?.signal,
      onFileChange: ([attachment]) => {
        dispatch.finishOperation(id, { attachment });
        dispatch.resumeItemByPostId(post);
      },
      onError: (error) => {
        dispatch.cancelItem(id, error);
        dispatch.resumeItemByPostId(post);
      }
    });
  };
}
function resizeCropItem(id, args) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    if (!args?.resize) {
      dispatch.finishOperation(id, {
        file: item.file
      });
      return;
    }
    const addSuffix = Boolean(item.parentId);
    const scaledSuffix = Boolean(args.isThresholdResize);
    try {
      const file = await vipsResizeImage(
        item.id,
        item.file,
        args.resize,
        false,
        // smartCrop
        addSuffix,
        item.abortController?.signal,
        scaledSuffix
      );
      const blobUrl = createBlobURL(file);
      dispatch({
        type: Type.CacheBlobUrl,
        id,
        blobUrl
      });
      dispatch.finishOperation(id, {
        file,
        attachment: {
          url: blobUrl
        }
      });
    } catch (error) {
      dispatch.cancelItem(
        id,
        new UploadError({
          code: "IMAGE_TRANSCODING_ERROR",
          message: "File could not be uploaded",
          file: item.file,
          cause: error instanceof Error ? error : void 0
        })
      );
    }
  };
}
function rotateItem(id, args) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    if (!args?.orientation || args.orientation === 1) {
      dispatch.finishOperation(id, {
        file: item.file
      });
      return;
    }
    try {
      const file = await vipsRotateImage(
        item.id,
        item.file,
        args.orientation,
        item.abortController?.signal
      );
      const blobUrl = createBlobURL(file);
      dispatch({
        type: Type.CacheBlobUrl,
        id,
        blobUrl
      });
      dispatch.finishOperation(id, {
        file,
        attachment: {
          url: blobUrl
        }
      });
    } catch (error) {
      dispatch.cancelItem(
        id,
        new UploadError({
          code: "IMAGE_ROTATION_ERROR",
          message: "Image could not be rotated",
          file: item.file,
          cause: error instanceof Error ? error : void 0
        })
      );
    }
  };
}
function transcodeImageItem(id, args) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    if (!args?.outputFormat) {
      dispatch.finishOperation(id, {
        file: item.file
      });
      return;
    }
    const outputMimeType = `image/${args.outputFormat}`;
    const quality = args.outputQuality ?? DEFAULT_OUTPUT_QUALITY;
    const interlaced = args.interlaced ?? false;
    try {
      const file = await vipsConvertImageFormat(
        item.id,
        item.file,
        outputMimeType,
        quality,
        interlaced
      );
      const blobUrl = createBlobURL(file);
      dispatch({
        type: Type.CacheBlobUrl,
        id,
        blobUrl
      });
      dispatch.finishOperation(id, {
        file,
        attachment: {
          url: blobUrl
        }
      });
    } catch (error) {
      dispatch.cancelItem(
        id,
        new UploadError({
          code: "MEDIA_TRANSCODING_ERROR",
          message: "Image could not be transcoded to the target format",
          file: item.file,
          cause: error instanceof Error ? error : void 0
        })
      );
    }
  };
}
function generateThumbnails(id) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    if (!item.attachment) {
      dispatch.finishOperation(id, {});
      return;
    }
    const attachment = item.attachment;
    const needsRotation = attachment.exif_orientation && attachment.exif_orientation !== 1 && !item.file.name.includes("-scaled");
    if (needsRotation && attachment.id) {
      try {
        const rotatedFile = await vipsRotateImage(
          item.id,
          item.sourceFile,
          attachment.exif_orientation,
          item.abortController?.signal
        );
        dispatch.addSideloadItem({
          file: rotatedFile,
          batchId: uuidv4(),
          parentId: item.id,
          additionalData: {
            post: attachment.id,
            image_size: "original",
            convert_format: false
          },
          operations: [OperationType.Upload]
        });
      } catch {
        console.warn(
          "Failed to rotate image, continuing with thumbnails"
        );
      }
    }
    if (!item.parentId && attachment.missing_image_sizes && attachment.missing_image_sizes.length > 0) {
      const file = attachment.filename ? renameFile(item.sourceFile, attachment.filename) : item.sourceFile;
      const batchId = uuidv4();
      const settings = select.getSettings();
      const allImageSizes = settings.allImageSizes || {};
      const { imageOutputFormats } = settings;
      const sourceType = item.sourceFile.type;
      const outputMimeType = imageOutputFormats?.[sourceType];
      let thumbnailTranscodeOperation = null;
      if (outputMimeType && outputMimeType !== sourceType) {
        thumbnailTranscodeOperation = await getTranscodeImageOperation(
          item.sourceFile,
          outputMimeType,
          settings
        );
      }
      for (const name of attachment.missing_image_sizes) {
        const imageSize = allImageSizes[name];
        if (!imageSize) {
          console.warn(
            `Image size "${name}" not found in configuration`
          );
          continue;
        }
        const thumbnailOperations = [
          [OperationType.ResizeCrop, { resize: imageSize }]
        ];
        if (thumbnailTranscodeOperation) {
          thumbnailOperations.push(thumbnailTranscodeOperation);
        }
        thumbnailOperations.push(OperationType.Upload);
        dispatch.addSideloadItem({
          file,
          onChange: ([updatedAttachment]) => {
            if (isBlobURL(updatedAttachment.url)) {
              return;
            }
            item.onChange?.([updatedAttachment]);
          },
          batchId,
          parentId: item.id,
          additionalData: {
            // Sideloading does not use the parent post ID but the
            // attachment ID as the image sizes need to be added to it.
            post: attachment.id,
            image_size: name,
            convert_format: false
          },
          operations: thumbnailOperations
        });
      }
      const { bigImageSizeThreshold } = settings;
      if (bigImageSizeThreshold && attachment.id) {
        const bitmap = await createImageBitmap(item.sourceFile);
        const needsScaling = bitmap.width > bigImageSizeThreshold || bitmap.height > bigImageSizeThreshold;
        bitmap.close();
        if (needsScaling) {
          const sourceForScaled = attachment.filename ? renameFile(item.sourceFile, attachment.filename) : item.sourceFile;
          const scaledOperations = [
            [
              OperationType.ResizeCrop,
              {
                resize: {
                  width: bigImageSizeThreshold,
                  height: bigImageSizeThreshold
                },
                isThresholdResize: true
              }
            ]
          ];
          if (thumbnailTranscodeOperation) {
            scaledOperations.push(thumbnailTranscodeOperation);
          }
          scaledOperations.push(OperationType.Upload);
          dispatch.addSideloadItem({
            file: sourceForScaled,
            onChange: ([updatedAttachment]) => {
              if (isBlobURL(updatedAttachment.url)) {
                return;
              }
              item.onChange?.([updatedAttachment]);
            },
            batchId,
            parentId: item.id,
            additionalData: {
              post: attachment.id,
              image_size: "scaled",
              convert_format: false
            },
            operations: scaledOperations
          });
        }
      }
    }
    dispatch.finishOperation(id, {});
  };
}
function revokeBlobUrls(id) {
  return async ({ select, dispatch }) => {
    const blobUrls = select.getBlobUrls(id);
    for (const blobUrl of blobUrls) {
      revokeBlobURL(blobUrl);
    }
    dispatch({
      type: Type.RevokeBlobUrls,
      id
    });
  };
}
function updateItemProgress(id, progress) {
  return async ({ dispatch }) => {
    dispatch({
      type: Type.UpdateProgress,
      id,
      progress
    });
  };
}
function updateSettings(settings) {
  return {
    type: Type.UpdateSettings,
    settings
  };
}
export {
  addItem,
  addSideloadItem,
  finishOperation,
  generateThumbnails,
  getTranscodeImageOperation,
  pauseItem,
  pauseQueue,
  prepareItem,
  processItem,
  removeItem,
  resizeCropItem,
  resumeItemByPostId,
  resumeQueue,
  revokeBlobUrls,
  rotateItem,
  sideloadItem,
  transcodeImageItem,
  updateItemProgress,
  updateSettings,
  uploadItem
};
//# sourceMappingURL=private-actions.mjs.map
