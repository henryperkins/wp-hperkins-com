/**
 * Internal dependencies
 */
import type { ItemId, ImageSizeCrop } from './types';
/**
 * Converts an image to a different format using vips in a worker.
 *
 * @param id         Item ID.
 * @param buffer     Original file buffer.
 * @param inputType  Input mime type.
 * @param outputType Output mime type.
 * @param quality    Desired quality.
 * @param interlaced Whether to use interlaced/progressive mode.
 * @return Converted file buffer.
 */
export declare function vipsConvertImageFormat(id: ItemId, buffer: ArrayBuffer, inputType: string, outputType: string, quality?: number, interlaced?: boolean): Promise<ArrayBuffer | ArrayBufferLike>;
/**
 * Compresses an existing image using vips in a worker.
 *
 * @param id         Item ID.
 * @param buffer     Original file buffer.
 * @param type       Mime type.
 * @param quality    Desired quality.
 * @param interlaced Whether to use interlaced/progressive mode.
 * @return Compressed file buffer.
 */
export declare function vipsCompressImage(id: ItemId, buffer: ArrayBuffer, type: string, quality?: number, interlaced?: boolean): Promise<ArrayBuffer | ArrayBufferLike>;
/**
 * Resizes an image using vips in a worker.
 *
 * @param id        Item ID.
 * @param buffer    Original file buffer.
 * @param type      Mime type.
 * @param resize    Resize options.
 * @param smartCrop Whether to use smart cropping (i.e. saliency-aware).
 * @param quality   Desired quality (0-1). Defaults to 0.82.
 * @return Processed file data plus the old and new dimensions.
 */
export declare function vipsResizeImage(id: ItemId, buffer: ArrayBuffer, type: string, resize: ImageSizeCrop, smartCrop?: boolean, quality?: number): Promise<{
    buffer: ArrayBuffer | ArrayBufferLike;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}>;
/**
 * Determines whether an image has an alpha channel using vips in a worker.
 *
 * @param buffer Original file buffer.
 * @return Whether the image has an alpha channel.
 */
export declare function vipsHasTransparency(buffer: ArrayBuffer): Promise<boolean>;
/**
 * Rotates an image based on EXIF orientation using vips in a worker.
 *
 * @param id          Item ID.
 * @param buffer      Original file buffer.
 * @param type        Mime type.
 * @param orientation EXIF orientation value (1-8).
 * @return Rotated file data plus the new dimensions.
 */
export declare function vipsRotateImage(id: ItemId, buffer: ArrayBuffer, type: string, orientation: number): Promise<{
    buffer: ArrayBuffer | ArrayBufferLike;
    width: number;
    height: number;
}>;
/**
 * Cancels all ongoing image operations for a given item ID.
 *
 * @param id Item ID.
 * @return Whether any operation was cancelled.
 */
export declare function vipsCancelOperations(id: ItemId): Promise<boolean>;
/**
 * Terminates the vips worker if it exists.
 * Call this to free up resources when vips processing is no longer needed.
 */
export declare function terminateVipsWorker(): void;
//# sourceMappingURL=vips-worker.d.ts.map