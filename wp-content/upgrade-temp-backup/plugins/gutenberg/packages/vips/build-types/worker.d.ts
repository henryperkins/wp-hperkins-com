/**
 * Worker entry point for vips image processing.
 *
 * This file exposes all vips functions to be available in the Web Worker
 * context. The @wordpress/worker-threads library handles the RPC
 * communication with the main thread.
 */
/**
 * Internal dependencies
 */
import { cancelOperations, convertImageFormat, compressImage, resizeImage, rotateImage, hasTransparency } from './index';
/**
 * The API object that exposes all vips functions to the main thread.
 */
declare const api: {
    cancelOperations: typeof cancelOperations;
    convertImageFormat: typeof convertImageFormat;
    compressImage: typeof compressImage;
    resizeImage: typeof resizeImage;
    rotateImage: typeof rotateImage;
    hasTransparency: typeof hasTransparency;
};
/**
 * Type export for use with wrap() on the main thread.
 */
export type WorkerAPI = typeof api;
export {};
//# sourceMappingURL=worker.d.ts.map