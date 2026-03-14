/**
 * Internal dependencies
 */
import type { ItemId, ImageSizeCrop } from './types';
/**
 * Cancels all ongoing image operations for a given item ID.
 *
 * The onProgress callbacks check for an IDs existence in this list,
 * killing the process if it's absent.
 *
 * @param id Item ID.
 * @return boolean Whether any operation was cancelled.
 */
export declare function cancelOperations(id: ItemId): Promise<boolean>;
/**
 * Converts an image to a different format using vips.
 *
 * @param id         Item ID.
 * @param buffer     Original file buffer.
 * @param inputType  Input mime type.
 * @param outputType Output mime type.
 * @param quality    Desired quality.
 * @param interlaced Whether to use interlaced/progressive mode.
 *                   Only used if the outputType supports it.
 */
export declare function convertImageFormat(id: ItemId, buffer: ArrayBuffer, inputType: string, outputType: string, quality?: number, interlaced?: boolean): Promise<ArrayBuffer | ArrayBufferLike>;
/**
 * Compresses an existing image using vips.
 *
 * @param id         Item ID.
 * @param buffer     Original file buffer.
 * @param type       Mime type.
 * @param quality    Desired quality.
 * @param interlaced Whether to use interlaced/progressive mode.
 *                   Only used if the outputType supports it.
 * @return Compressed file data.
 */
export declare function compressImage(id: ItemId, buffer: ArrayBuffer, type: string, quality?: number, interlaced?: boolean): Promise<ArrayBuffer | ArrayBufferLike>;
/**
 * Resizes an image using vips.
 *
 * @param id        Item ID.
 * @param buffer    Original file buffer.
 * @param type      Mime type.
 * @param resize    Resize options.
 * @param smartCrop Whether to use smart cropping (i.e. saliency-aware).
 * @param quality   Desired quality (0-1).
 * @return Processed file data plus the old and new dimensions.
 */
export declare function resizeImage(id: ItemId, buffer: ArrayBuffer, type: string, resize: ImageSizeCrop, smartCrop?: boolean, quality?: number): Promise<{
    buffer: ArrayBuffer | ArrayBufferLike;
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
}>;
/**
 * Rotates an image based on EXIF orientation value.
 *
 * EXIF orientation values:
 * 1 = Normal (no rotation needed)
 * 2 = Flipped horizontally
 * 3 = Rotated 180°
 * 4 = Flipped vertically
 * 5 = Rotated 90° CCW and flipped horizontally
 * 6 = Rotated 90° CW
 * 7 = Rotated 90° CW and flipped horizontally
 * 8 = Rotated 90° CCW
 *
 * @param id          Item ID.
 * @param buffer      Original file buffer.
 * @param type        Mime type.
 * @param orientation EXIF orientation value (1-8).
 * @return Rotated file data plus the new dimensions.
 */
export declare function rotateImage(id: ItemId, buffer: ArrayBuffer, type: string, orientation: number): Promise<{
    buffer: ArrayBuffer | ArrayBufferLike;
    width: number;
    height: number;
}>;
/**
 * Determines whether an image has an alpha channel.
 *
 * @param buffer Original file object.
 * @return Whether the image has an alpha channel.
 */
export declare function hasTransparency(buffer: ArrayBuffer): Promise<boolean>;
export { convertImageFormat as vipsConvertImageFormat, compressImage as vipsCompressImage, resizeImage as vipsResizeImage, rotateImage as vipsRotateImage, hasTransparency as vipsHasTransparency, cancelOperations as vipsCancelOperations, };
//# sourceMappingURL=index.d.ts.map