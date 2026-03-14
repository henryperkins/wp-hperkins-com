/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
/**
 * Compute the template slug to look up in the template hierarchy.
 *
 * In `draft` status we might not have a slug available, so we use the
 * `single` post type template slug (e.g. page, single-post,
 * single-product, etc.). Pages do not need the `single` prefix to be
 * prioritised through template hierarchy.
 *
 * @param postType The post type.
 * @param slug     The post slug.
 */
export declare function getTemplateSlugToCheck(postType: string, slug: string | undefined): string;
/**
 * Resolve the human-readable label for the default template that would
 * apply to a post, given its type, ID and slug. Meant to be called inside a
 * `useSelect` callback (receives `select` as its first argument).
 *
 * @param select   The `select` function from a `useSelect` callback.
 * @param postType The post type.
 * @param postId   The post ID.
 * @param slug     The post slug.
 */
export declare function getDefaultTemplateLabel(select: (store: typeof coreStore) => any, postType: string | undefined, postId: string | number | undefined, slug: string | undefined): string;
//# sourceMappingURL=utils.d.ts.map