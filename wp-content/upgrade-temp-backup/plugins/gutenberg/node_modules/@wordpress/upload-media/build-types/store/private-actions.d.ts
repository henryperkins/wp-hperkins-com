import type { createRegistry } from '@wordpress/data';
type WPDataRegistry = ReturnType<typeof createRegistry>;
import type { AdditionalData, BatchId, OnBatchSuccessHandler, OnChangeHandler, OnErrorHandler, OnSuccessHandler, Operation, OperationArgs, PauseQueueAction, QueueItem, QueueItemId, Settings, State, UpdateSettingsAction } from './types';
import { OperationType } from './types';
import type { cancelItem } from './actions';
type ActionCreators = {
    cancelItem: typeof cancelItem;
    addItem: typeof addItem;
    addSideloadItem: typeof addSideloadItem;
    removeItem: typeof removeItem;
    pauseItem: typeof pauseItem;
    resumeItemByPostId: typeof resumeItemByPostId;
    prepareItem: typeof prepareItem;
    processItem: typeof processItem;
    finishOperation: typeof finishOperation;
    uploadItem: typeof uploadItem;
    sideloadItem: typeof sideloadItem;
    resizeCropItem: typeof resizeCropItem;
    rotateItem: typeof rotateItem;
    transcodeImageItem: typeof transcodeImageItem;
    generateThumbnails: typeof generateThumbnails;
    updateItemProgress: typeof updateItemProgress;
    revokeBlobUrls: typeof revokeBlobUrls;
    <T = Record<string, unknown>>(args: T): void;
};
type AllSelectors = typeof import('./selectors') & typeof import('./private-selectors');
type CurriedState<F> = F extends (state: State, ...args: infer P) => infer R ? (...args: P) => R : F;
type Selectors = {
    [key in keyof AllSelectors]: CurriedState<AllSelectors[key]>;
};
type ThunkArgs = {
    select: Selectors;
    dispatch: ActionCreators;
    registry: WPDataRegistry;
};
interface AddItemArgs {
    file: File | Blob;
    batchId?: BatchId;
    onChange?: OnChangeHandler;
    onSuccess?: OnSuccessHandler;
    onError?: OnErrorHandler;
    onBatchSuccess?: OnBatchSuccessHandler;
    additionalData?: AdditionalData;
    sourceUrl?: string;
    sourceAttachmentId?: number;
    abortController?: AbortController;
    operations?: Operation[];
}
/**
 * Adds a new item to the upload queue.
 *
 * @param $0
 * @param $0.file                 File
 * @param [$0.batchId]            Batch ID.
 * @param [$0.onChange]           Function called each time a file or a temporary representation of the file is available.
 * @param [$0.onSuccess]          Function called after the file is uploaded.
 * @param [$0.onBatchSuccess]     Function called after a batch of files is uploaded.
 * @param [$0.onError]            Function called when an error happens.
 * @param [$0.additionalData]     Additional data to include in the request.
 * @param [$0.sourceUrl]          Source URL. Used when importing a file from a URL or optimizing an existing file.
 * @param [$0.sourceAttachmentId] Source attachment ID. Used when optimizing an existing file for example.
 * @param [$0.abortController]    Abort controller for upload cancellation.
 * @param [$0.operations]         List of operations to perform. Defaults to automatically determined list, based on the file.
 */
export declare function addItem({ file: fileOrBlob, batchId, onChange, onSuccess, onBatchSuccess, onError, additionalData, sourceUrl, sourceAttachmentId, abortController, operations, }: AddItemArgs): ({ dispatch }: ThunkArgs) => Promise<void>;
interface AddSideloadItemArgs {
    file: File;
    onChange?: OnChangeHandler;
    additionalData?: AdditionalData;
    operations?: Operation[];
    batchId?: BatchId;
    parentId?: QueueItemId;
}
/**
 * Adds a new item to the upload queue for sideloading.
 *
 * This is typically a client-side generated thumbnail.
 *
 * @param $0
 * @param $0.file             File
 * @param [$0.batchId]        Batch ID.
 * @param [$0.parentId]       Parent ID.
 * @param [$0.onChange]       Function called each time a file or a temporary representation of the file is available.
 * @param [$0.additionalData] Additional data to include in the request.
 * @param [$0.operations]     List of operations to perform. Defaults to automatically determined list, based on the file.
 */
export declare function addSideloadItem({ file, onChange, additionalData, operations, batchId, parentId, }: AddSideloadItemArgs): ({ dispatch }: ThunkArgs) => void;
/**
 * Processes a single item in the queue.
 *
 * Runs the next operation in line and invokes any callbacks.
 *
 * @param id Item ID.
 */
export declare function processItem(id: QueueItemId): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Returns an action object that pauses all processing in the queue.
 *
 * Useful for testing purposes.
 *
 * @return Action object.
 */
export declare function pauseQueue(): PauseQueueAction;
/**
 * Resumes all processing in the queue.
 *
 * Dispatches an action object for resuming the queue itself,
 * and triggers processing for each remaining item in the queue individually.
 */
export declare function resumeQueue(): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Pauses a specific item in the queue.
 *
 * @param id Item ID.
 */
export declare function pauseItem(id: QueueItemId): ({ dispatch }: ThunkArgs) => Promise<void>;
/**
 * Resumes processing for a given post/attachment ID.
 *
 * This function looks up paused uploads by post ID and resumes them.
 * It's typically called after a sideload completes to resume paused
 * thumbnail uploads.
 *
 * @param postOrAttachmentId Post or attachment ID.
 */
export declare function resumeItemByPostId(postOrAttachmentId: number): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Removes a specific item from the queue.
 *
 * @param id Item ID.
 */
export declare function removeItem(id: QueueItemId): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Finishes an operation for a given item ID and immediately triggers processing the next one.
 *
 * @param id      Item ID.
 * @param updates Updated item data.
 */
export declare function finishOperation(id: QueueItemId, updates: Partial<QueueItem>): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Determines if an image should be transcoded to a different format.
 *
 * Handles PNG to JPEG conversion carefully by checking for transparency
 * to preserve the alpha channel when needed.
 *
 * @param file           The image file.
 * @param outputMimeType The target output MIME type.
 * @param settings       Media settings.
 * @return The transcode operation tuple if transcoding is needed, null otherwise.
 */
export declare function getTranscodeImageOperation(file: File, outputMimeType: string, settings: Settings): Promise<[
    OperationType.TranscodeImage,
    OperationArgs[OperationType.TranscodeImage]
] | null>;
/**
 * Prepares an item for initial processing.
 *
 * Determines the list of operations to perform for a given image,
 * depending on its media type.
 *
 * For example, HEIF images first need to be converted, resized,
 * compressed, and then uploaded.
 *
 * Or videos need to be compressed, and then need poster generation
 * before upload.
 *
 * @param id Item ID.
 */
export declare function prepareItem(id: QueueItemId): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Uploads an item to the server.
 *
 * @param id Item ID.
 */
export declare function uploadItem(id: QueueItemId): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Sideloads an item to the server.
 *
 * @param id Item ID.
 */
export declare function sideloadItem(id: QueueItemId): ({ select, dispatch }: ThunkArgs) => Promise<void>;
type ResizeCropItemArgs = OperationArgs[OperationType.ResizeCrop];
/**
 * Resizes and crops an existing image item.
 *
 * @param id     Item ID.
 * @param [args] Additional arguments for the operation.
 */
export declare function resizeCropItem(id: QueueItemId, args?: ResizeCropItemArgs): ({ select, dispatch }: ThunkArgs) => Promise<void>;
type RotateItemArgs = OperationArgs[OperationType.Rotate];
/**
 * Rotates an image based on EXIF orientation.
 *
 * This is used for images that need rotation but don't need resizing
 * (i.e., smaller than the big image size threshold).
 * Matches WordPress core's behavior of creating a '-rotated' version.
 *
 * @param id     Item ID.
 * @param [args] Rotation arguments including EXIF orientation value.
 */
export declare function rotateItem(id: QueueItemId, args?: RotateItemArgs): ({ select, dispatch }: ThunkArgs) => Promise<void>;
type TranscodeImageItemArgs = OperationArgs[OperationType.TranscodeImage];
/**
 * Transcodes an image to a different format.
 *
 * This operation converts images between formats (e.g., PNG to WebP, JPEG to AVIF)
 * based on the WordPress image_editor_output_format filter settings.
 *
 * @param id     Item ID.
 * @param [args] Transcode arguments including output format, quality, and interlace settings.
 */
export declare function transcodeImageItem(id: QueueItemId, args?: TranscodeImageItemArgs): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Adds thumbnail versions to the queue for sideloading.
 *
 * Also handles image rotation for images that need EXIF-based rotation
 * but weren't scaled down (and thus weren't auto-rotated by vips).
 *
 * @param id Item ID.
 */
export declare function generateThumbnails(id: QueueItemId): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Revokes all blob URLs for a given item, freeing up memory.
 *
 * @param id Item ID.
 */
export declare function revokeBlobUrls(id: QueueItemId): ({ select, dispatch }: ThunkArgs) => Promise<void>;
/**
 * Updates the progress of an item.
 *
 * @param id       Item ID.
 * @param progress Progress value (0-100).
 */
export declare function updateItemProgress(id: QueueItemId, progress: number): ({ dispatch }: ThunkArgs) => Promise<void>;
/**
 * Returns an action object that updates the store settings.
 *
 * Useful for testing purposes.
 *
 * @param settings
 * @return Action object.
 */
export declare function updateSettings(settings: Partial<Settings>): UpdateSettingsAction;
export {};
//# sourceMappingURL=private-actions.d.ts.map