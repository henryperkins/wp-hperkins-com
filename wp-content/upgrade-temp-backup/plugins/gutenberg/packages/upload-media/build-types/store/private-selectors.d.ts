/**
 * Internal dependencies
 */
import { type BatchId, type QueueItem, type QueueItemId, type State } from './types';
/**
 * Returns all items currently being uploaded.
 *
 * @param state Upload state.
 *
 * @return Queue items.
 */
export declare function getAllItems(state: State): QueueItem[];
/**
 * Returns a specific item given its unique ID.
 *
 * @param state Upload state.
 * @param id    Item ID.
 *
 * @return Queue item.
 */
export declare function getItem(state: State, id: QueueItemId): QueueItem | undefined;
/**
 * Determines whether a batch has been successfully uploaded, given its unique ID.
 *
 * @param state   Upload state.
 * @param batchId Batch ID.
 *
 * @return Whether a batch has been uploaded.
 */
export declare function isBatchUploaded(state: State, batchId: BatchId): boolean;
/**
 * Determines whether an upload is currently in progress given a post or attachment ID.
 *
 * @param state              Upload state.
 * @param postOrAttachmentId Post ID or attachment ID.
 *
 * @return Whether upload is currently in progress for the given post or attachment.
 */
export declare function isUploadingToPost(state: State, postOrAttachmentId: number): boolean;
/**
 * Returns the next paused upload for a given post or attachment ID.
 *
 * @param state              Upload state.
 * @param postOrAttachmentId Post ID or attachment ID.
 *
 * @return Paused item.
 */
export declare function getPausedUploadForPost(state: State, postOrAttachmentId: number): QueueItem | undefined;
/**
 * Determines whether uploading is currently paused.
 *
 * @param state Upload state.
 *
 * @return Whether uploading is currently paused.
 */
export declare function isPaused(state: State): boolean;
/**
 * Returns all cached blob URLs for a given item ID.
 *
 * @param state Upload state.
 * @param id    Item ID
 *
 * @return List of blob URLs.
 */
export declare function getBlobUrls(state: State, id: QueueItemId): string[];
/**
 * Returns the number of items currently uploading.
 *
 * @param state Upload state.
 *
 * @return Number of items currently uploading.
 */
export declare function getActiveUploadCount(state: State): number;
/**
 * Returns items that are waiting for upload (next operation is Upload but not yet started).
 *
 * @param state Upload state.
 *
 * @return Items pending upload.
 */
export declare function getPendingUploads(state: State): QueueItem[];
/**
 * Returns the number of items currently performing image processing operations.
 *
 * This counts items whose current operation is ResizeCrop or Rotate,
 * used to enforce the image processing concurrency limit.
 *
 * @param state Upload state.
 *
 * @return Number of items currently processing images.
 */
export declare function getActiveImageProcessingCount(state: State): number;
/**
 * Returns items waiting for image processing (next operation is ResizeCrop
 * or Rotate but not yet started).
 *
 * @param state Upload state.
 *
 * @return Items pending image processing.
 */
export declare function getPendingImageProcessing(state: State): QueueItem[];
/**
 * Returns items that failed with an error.
 *
 * @param state Upload state.
 *
 * @return Failed items.
 */
export declare function getFailedItems(state: State): QueueItem[];
/**
 * Returns true if any child items with the given parentId exist in the queue.
 *
 * @param state    Upload state.
 * @param parentId Parent item ID.
 *
 * @return Whether any child items with the given parentId exist in the queue.
 */
export declare function hasPendingItemsByParentId(state: State, parentId: QueueItemId): boolean;
/**
 * Returns the progress of a specific item.
 *
 * @param state Upload state.
 * @param id    Item ID.
 *
 * @return Progress value (0-100), or undefined if item not found.
 */
export declare function getItemProgress(state: State, id: QueueItemId): number | undefined;
//# sourceMappingURL=private-selectors.d.ts.map