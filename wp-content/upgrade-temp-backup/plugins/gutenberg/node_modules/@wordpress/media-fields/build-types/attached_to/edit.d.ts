import type { DataFormControlProps } from '@wordpress/dataviews';
/**
 * Internal dependencies
 */
import type { MediaItem } from '../types';
export type SearchResult = {
    /**
     * Post or term id.
     */
    id: number;
    /**
     * Link url.
     */
    url: string;
    /**
     * Title of the link.
     */
    title: string;
    /**
     * The taxonomy or post type slug or type URL.
     */
    type: string;
    /**
     * Link kind of post-type or taxonomy
     */
    kind?: string;
};
export default function MediaAttachedToEdit({ data, onChange, }: DataFormControlProps<MediaItem>): import("react").JSX.Element;
//# sourceMappingURL=edit.d.ts.map