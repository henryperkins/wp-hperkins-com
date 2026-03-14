/**
 * Media type result.
 */
export interface MediaType {
    type: 'image' | 'video' | 'audio' | 'application';
}
/**
 * Determines the media type from a MIME type string.
 *
 * @param mimeType - The MIME type to check.
 * @return Object with type property ('image', 'video', 'audio', or 'application').
 */
export declare function getMediaTypeFromMimeType(mimeType?: string): MediaType;
//# sourceMappingURL=get-media-type.d.ts.map