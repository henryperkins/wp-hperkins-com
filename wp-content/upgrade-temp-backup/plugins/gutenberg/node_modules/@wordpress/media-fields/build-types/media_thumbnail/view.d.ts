import type { Attachment } from '@wordpress/core-data';
import type { DataViewRenderFieldProps } from '@wordpress/dataviews';
import type { MediaItem } from '../types';
/**
 * Given the available image sizes and a target display width, returns the URL
 * of the smallest size whose width is >= the target. Falls back to the largest
 * available size, or the original source_url.
 *
 * @param featuredMedia The media item with size details.
 * @param configSizes   The target display size string (e.g. '900px').
 */
export declare function getBestImageUrl(featuredMedia: Attachment | MediaItem, configSizes?: string): string;
export default function MediaThumbnailView({ item, config, }: DataViewRenderFieldProps<MediaItem>): import("react").JSX.Element | null;
//# sourceMappingURL=view.d.ts.map