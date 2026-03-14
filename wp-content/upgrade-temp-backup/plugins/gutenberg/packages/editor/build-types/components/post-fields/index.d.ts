import type { Field } from '@wordpress/dataviews';
import type { BasePostWithEmbeddedAuthor } from '@wordpress/fields';
declare function usePostFields({ postType, }: {
    postType: string;
}): Field<BasePostWithEmbeddedAuthor>[];
/**
 * Hook to get the fields for a post (BasePost or BasePostWithEmbeddedAuthor).
 */
export default usePostFields;
//# sourceMappingURL=index.d.ts.map