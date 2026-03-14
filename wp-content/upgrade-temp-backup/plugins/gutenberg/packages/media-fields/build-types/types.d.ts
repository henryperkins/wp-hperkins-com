/**
 * WordPress dependencies
 */
import type { Attachment, Updatable, Post, User } from '@wordpress/core-data';
export type MediaKind = 'image' | 'video' | 'audio' | 'application';
export interface MediaType {
    type: MediaKind;
    label: string;
    icon: React.JSX.Element;
}
export interface MediaItem extends Attachment<'edit'> {
    featured_media: number;
    _embedded?: {
        'wp:attached-to'?: Post[] | Partial<Post>[];
        author?: User[] | Partial<User>[];
    };
}
export type MediaItemUpdatable = Updatable<Attachment>;
//# sourceMappingURL=types.d.ts.map