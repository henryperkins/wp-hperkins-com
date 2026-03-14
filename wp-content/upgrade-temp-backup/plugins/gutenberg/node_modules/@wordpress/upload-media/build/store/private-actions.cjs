"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/upload-media/src/store/private-actions.ts
var private_actions_exports = {};
__export(private_actions_exports, {
  addItem: () => addItem,
  addSideloadItem: () => addSideloadItem,
  finishOperation: () => finishOperation,
  generateThumbnails: () => generateThumbnails,
  getTranscodeImageOperation: () => getTranscodeImageOperation,
  pauseItem: () => pauseItem,
  pauseQueue: () => pauseQueue,
  prepareItem: () => prepareItem,
  processItem: () => processItem,
  removeItem: () => removeItem,
  resizeCropItem: () => resizeCropItem,
  resumeItemByPostId: () => resumeItemByPostId,
  resumeQueue: () => resumeQueue,
  revokeBlobUrls: () => revokeBlobUrls,
  rotateItem: () => rotateItem,
  sideloadItem: () => sideloadItem,
  transcodeImageItem: () => transcodeImageItem,
  updateItemProgress: () => updateItemProgress,
  updateSettings: () => updateSettings,
  uploadItem: () => uploadItem
});
module.exports = __toCommonJS(private_actions_exports);
var import_uuid = require("uuid");
var import_blob = require("@wordpress/blob");
var import_utils = require("../utils.cjs");
var import_constants = require("./constants.cjs");
var import_stub_file = require("../stub-file.cjs");
var import_upload_error = require("../upload-error.cjs");
var import_utils2 = require("./utils/index.cjs");
var import_types = require("./types.cjs");
var DEFAULT_OUTPUT_QUALITY = 0.82;
function shouldPauseForSideload(item, operation, select) {
  if (operation !== import_types.OperationType.Upload || !item.parentId || !item.additionalData.post) {
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
    const itemId = (0, import_uuid.v4)();
    const file = (0, import_utils.convertBlobToFile)(fileOrBlob);
    let blobUrl;
    if (!(file instanceof import_stub_file.StubFile)) {
      blobUrl = (0, import_blob.createBlobURL)(file);
      dispatch({
        type: import_types.Type.CacheBlobUrl,
        id: itemId,
        blobUrl
      });
    }
    dispatch({
      type: import_types.Type.Add,
      item: {
        id: itemId,
        batchId,
        status: import_types.ItemStatus.Processing,
        sourceFile: (0, import_utils.cloneFile)(file),
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
        operations: Array.isArray(operations) ? operations : [import_types.OperationType.Prepare]
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
    const itemId = (0, import_uuid.v4)();
    dispatch({
      type: import_types.Type.Add,
      item: {
        id: itemId,
        batchId,
        status: import_types.ItemStatus.Processing,
        sourceFile: (0, import_utils.cloneFile)(file),
        file,
        onChange,
        additionalData: {
          ...additionalData
        },
        parentId,
        operations: Array.isArray(operations) ? operations : [import_types.OperationType.Prepare],
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
        type: import_types.Type.PauseItem,
        id
      });
      return;
    }
    if (operation === import_types.OperationType.Upload) {
      const settings = select.getSettings();
      const activeCount = select.getActiveUploadCount();
      if (activeCount >= settings.maxConcurrentUploads) {
        return;
      }
    }
    if (operation === import_types.OperationType.ResizeCrop || operation === import_types.OperationType.Rotate) {
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
      type: import_types.Type.OperationStart,
      id,
      operation
    });
    switch (operation) {
      case import_types.OperationType.Prepare:
        dispatch.prepareItem(item.id);
        break;
      case import_types.OperationType.ResizeCrop:
        dispatch.resizeCropItem(
          item.id,
          operationArgs
        );
        break;
      case import_types.OperationType.Rotate:
        dispatch.rotateItem(
          item.id,
          operationArgs
        );
        break;
      case import_types.OperationType.TranscodeImage:
        dispatch.transcodeImageItem(
          item.id,
          operationArgs
        );
        break;
      case import_types.OperationType.Upload:
        if (item.parentId) {
          dispatch.sideloadItem(id);
        } else {
          dispatch.uploadItem(id);
        }
        break;
      case import_types.OperationType.ThumbnailGeneration:
        dispatch.generateThumbnails(id);
        break;
    }
  };
}
function pauseQueue() {
  return {
    type: import_types.Type.PauseQueue
  };
}
function resumeQueue() {
  return async ({ select, dispatch }) => {
    dispatch({
      type: import_types.Type.ResumeQueue
    });
    for (const item of select.getAllItems()) {
      dispatch.processItem(item.id);
    }
  };
}
function pauseItem(id) {
  return async ({ dispatch }) => {
    dispatch({
      type: import_types.Type.PauseItem,
      id
    });
  };
}
function resumeItemByPostId(postOrAttachmentId) {
  return async ({ select, dispatch }) => {
    const item = select.getPausedUploadForPost(postOrAttachmentId);
    if (item) {
      dispatch({
        type: import_types.Type.ResumeItem,
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
      type: import_types.Type.Remove,
      id
    });
    if (select.getAllItems().length === 0) {
      (0, import_utils2.terminateVipsWorker)();
    }
  };
}
function finishOperation(id, updates) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    const previousOperation = item?.currentOperation;
    dispatch({
      type: import_types.Type.OperationFinish,
      id,
      item: updates
    });
    dispatch.processItem(id);
    if (previousOperation === import_types.OperationType.Upload) {
      const pendingUploads = select.getPendingUploads();
      for (const pendingItem of pendingUploads) {
        dispatch.processItem(pendingItem.id);
      }
    }
    if (previousOperation === import_types.OperationType.ResizeCrop || previousOperation === import_types.OperationType.Rotate) {
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
    const blobUrl = (0, import_blob.createBlobURL)(file);
    try {
      const hasAlpha = await (0, import_utils2.vipsHasTransparency)(blobUrl);
      if (hasAlpha) {
        return null;
      }
    } catch {
      return null;
    } finally {
      (0, import_blob.revokeBlobURL)(blobUrl);
    }
  }
  const formatPart = outputMimeType.split("/")[1];
  if (!isValidImageFormat(formatPart)) {
    return null;
  }
  return [
    import_types.OperationType.TranscodeImage,
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
    const isVipsSupported = import_constants.CLIENT_SIDE_SUPPORTED_MIME_TYPES.includes(
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
        import_types.OperationType.Upload,
        import_types.OperationType.ThumbnailGeneration
      );
    } else {
      operations.push(import_types.OperationType.Upload);
    }
    dispatch({
      type: import_types.Type.AddOperations,
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
        if (!(0, import_blob.isBlobURL)(attachment.url)) {
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
      const file = await (0, import_utils2.vipsResizeImage)(
        item.id,
        item.file,
        args.resize,
        false,
        // smartCrop
        addSuffix,
        item.abortController?.signal,
        scaledSuffix
      );
      const blobUrl = (0, import_blob.createBlobURL)(file);
      dispatch({
        type: import_types.Type.CacheBlobUrl,
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
        new import_upload_error.UploadError({
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
      const file = await (0, import_utils2.vipsRotateImage)(
        item.id,
        item.file,
        args.orientation,
        item.abortController?.signal
      );
      const blobUrl = (0, import_blob.createBlobURL)(file);
      dispatch({
        type: import_types.Type.CacheBlobUrl,
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
        new import_upload_error.UploadError({
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
      const file = await (0, import_utils2.vipsConvertImageFormat)(
        item.id,
        item.file,
        outputMimeType,
        quality,
        interlaced
      );
      const blobUrl = (0, import_blob.createBlobURL)(file);
      dispatch({
        type: import_types.Type.CacheBlobUrl,
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
        new import_upload_error.UploadError({
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
        const rotatedFile = await (0, import_utils2.vipsRotateImage)(
          item.id,
          item.sourceFile,
          attachment.exif_orientation,
          item.abortController?.signal
        );
        dispatch.addSideloadItem({
          file: rotatedFile,
          batchId: (0, import_uuid.v4)(),
          parentId: item.id,
          additionalData: {
            post: attachment.id,
            image_size: "original",
            convert_format: false
          },
          operations: [import_types.OperationType.Upload]
        });
      } catch {
        console.warn(
          "Failed to rotate image, continuing with thumbnails"
        );
      }
    }
    if (!item.parentId && attachment.missing_image_sizes && attachment.missing_image_sizes.length > 0) {
      const file = attachment.filename ? (0, import_utils.renameFile)(item.sourceFile, attachment.filename) : item.sourceFile;
      const batchId = (0, import_uuid.v4)();
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
          [import_types.OperationType.ResizeCrop, { resize: imageSize }]
        ];
        if (thumbnailTranscodeOperation) {
          thumbnailOperations.push(thumbnailTranscodeOperation);
        }
        thumbnailOperations.push(import_types.OperationType.Upload);
        dispatch.addSideloadItem({
          file,
          onChange: ([updatedAttachment]) => {
            if ((0, import_blob.isBlobURL)(updatedAttachment.url)) {
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
          const sourceForScaled = attachment.filename ? (0, import_utils.renameFile)(item.sourceFile, attachment.filename) : item.sourceFile;
          const scaledOperations = [
            [
              import_types.OperationType.ResizeCrop,
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
          scaledOperations.push(import_types.OperationType.Upload);
          dispatch.addSideloadItem({
            file: sourceForScaled,
            onChange: ([updatedAttachment]) => {
              if ((0, import_blob.isBlobURL)(updatedAttachment.url)) {
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
      (0, import_blob.revokeBlobURL)(blobUrl);
    }
    dispatch({
      type: import_types.Type.RevokeBlobUrls,
      id
    });
  };
}
function updateItemProgress(id, progress) {
  return async ({ dispatch }) => {
    dispatch({
      type: import_types.Type.UpdateProgress,
      id,
      progress
    });
  };
}
function updateSettings(settings) {
  return {
    type: import_types.Type.UpdateSettings,
    settings
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=private-actions.cjs.map
