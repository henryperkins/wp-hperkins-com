/**
 * Normalizes a rotation value to be within the range of 0-360 degrees.
 * So a rotation of -90 becomes 270, -45 becomes 315, etc.
 * This is required because the `/media/edit` calculates the rotation value
 * by subtracting the rotation value from 0. ImageMagick rotates clockwise only and will subtract the rotation value from 360.
 * It's utterly confusing, and probably in need of a refactor.
 *
 * @param {number} rotation - The rotation value to normalize.
 * @return {number} The normalized rotation value.
 */
export declare const normalizeRotation: (rotation: number) => number;
/**
 * Creates an image from a URL.
 *
 * @param {string} url - The URL of the image to create.
 * @return {Promise<HTMLImageElement>} A promise that resolves to the image.
 */
export declare const createImage: (url: string) => Promise<unknown>;
/**
 * Converts a degree value to a radian value.
 *
 * @param {number} degreeValue - The degree value to convert.
 * @return {number} The radian value.
 */
export declare function getRadianAngle(degreeValue: number): number;
/**
 * Returns the new bounding area of a rotated rectangle.
 *
 * @param {number} width    - The width of the rectangle.
 * @param {number} height   - The height of the rectangle.
 * @param {number} rotation - The rotation of the rectangle.
 * @return {Object} The new bounding area of the rotated rectangle.
 */
export declare function rotateSize(width: number, height: number, rotation: number): {
    width: number;
    height: number;
};
/**
 * Crops an image to a given area.
 *
 * @param {string} imageSrc         - The source of the image to crop.
 * @param {Object} pixelCrop        - The area to crop.
 * @param          pixelCrop.x
 * @param          pixelCrop.y
 * @param          pixelCrop.width
 * @param          pixelCrop.height
 * @param {number} rotation         - The rotation of the image.
 * @param {Object} flip             - The flip of the image.
 * @return {Promise<string | null>} A promise that resolves to the cropped image.
 */
export declare function getCroppedImage(imageSrc: string, pixelCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
}, rotation?: number, flip?: {
    horizontal: boolean;
    vertical: boolean;
}): Promise<string | null>;
//# sourceMappingURL=utils.d.ts.map