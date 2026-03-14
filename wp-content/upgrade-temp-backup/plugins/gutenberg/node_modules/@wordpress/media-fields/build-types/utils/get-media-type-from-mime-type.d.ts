/**
 * Internal dependencies
 */
import type { MediaType } from '../types';
/**
 * Get the media type from a mime type, including an icon.
 * TODO - media types should be formalized somewhere.
 *
 * References:
 * https://developer.wordpress.org/reference/functions/wp_mime_type_icon/
 * https://developer.wordpress.org/reference/hooks/mime_types/
 * https://developer.wordpress.org/reference/functions/wp_get_mime_types/
 *
 * @param mimeType - The mime type to get the media type from.
 * @return The media type.
 */
export declare function getMediaTypeFromMimeType(mimeType: string): MediaType;
//# sourceMappingURL=get-media-type-from-mime-type.d.ts.map