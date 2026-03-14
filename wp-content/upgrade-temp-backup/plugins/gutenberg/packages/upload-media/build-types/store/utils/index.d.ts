/**
 * Internal dependencies
 */
import { ImageFile } from '../../image-file';
import type { ImageSizeCrop, QueueItemId } from '../types';
/**
 * Converts an image to a different format using vips in a web worker.
 *
 * @param id         Queue item ID.
 * @param file       File object.
 * @param type       Output mime type.
 * @param quality    Desired quality (0-1).
 * @param interlaced Whether to use interlaced/progressive mode.
 * @return Converted file.
 */
export declare function vipsConvertImageFormat(id: QueueItemId, file: File, type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif' | 'image/gif', quality: number, interlaced?: boolean): Promise<File>;
/**
 * Compresses an image using vips in a web worker.
 *
 * @param id         Queue item ID.
 * @param file       File object.
 * @param quality    Desired quality (0-1).
 * @param interlaced Whether to use interlaced/progressive mode.
 * @return Compressed file.
 */
export declare function vipsCompressImage(id: QueueItemId, file: File, quality: number, interlaced?: boolean): Promise<File>;
/**
 * Checks whether an image has transparency using vips in a web worker.
 *
 * @param url Image URL.
 * @return Whether the image has transparency.
 */
export declare function vipsHasTransparency(url: string): Promise<boolean>;
/**
 * Resizes an image using vips in a web worker.
 *
 * @param id           Queue item ID.
 * @param file         File object.
 * @param resize       Resize options (width, height, crop).
 * @param smartCrop    Whether to use smart cropping (saliency-aware).
 * @param addSuffix    Whether to add dimension suffix to filename.
 * @param signal       Optional abort signal to cancel the operation.
 * @param scaledSuffix Whether to add '-scaled' suffix instead of dimensions (for big image threshold).
 * @param quality      Desired quality (0-1). Defaults to 0.82.
 * @return Resized ImageFile with dimension metadata.
 */
export declare function vipsResizeImage(id: QueueItemId, file: File, resize: ImageSizeCrop, smartCrop: boolean, addSuffix: boolean, signal?: AbortSignal, scaledSuffix?: boolean, quality?: number): Promise<ImageFile>;
/**
 * Rotates an image based on EXIF orientation using vips in a web worker.
 *
 * This applies the correct rotation/flip transformation based on the EXIF
 * orientation value (1-8), and adds a '-rotated' suffix to the filename.
 * This matches WordPress core's behavior when rotating images based on EXIF.
 *
 * @param id          Queue item ID.
 * @param file        File object.
 * @param orientation EXIF orientation value (1-8).
 * @param signal      Optional abort signal to cancel the operation.
 * @return Rotated ImageFile with updated dimensions.
 */
export declare function vipsRotateImage(id: QueueItemId, file: File, orientation: number, signal?: AbortSignal): Promise<File>;
/**
 * Cancels all ongoing image operations for the given item.
 *
 * If the vips module has not been loaded yet, there can be no active
 * operations to cancel.
 *
 * @param id Queue item ID to cancel operations for.
 * @return Whether any operation was cancelled.
 */
export declare function vipsCancelOperations(id: QueueItemId): Promise<boolean>;
/**
 * Terminates the vips worker if it has been loaded.
 *
 * If the vips module has not been loaded yet (i.e., no image processing
 * has occurred), this is a no-op since there is no worker to terminate.
 */
export declare function terminateVipsWorker(): void;
//# sourceMappingURL=index.d.ts.map