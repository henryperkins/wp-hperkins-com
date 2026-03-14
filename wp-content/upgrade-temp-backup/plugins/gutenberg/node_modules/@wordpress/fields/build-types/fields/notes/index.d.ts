/**
 * WordPress dependencies
 */
import type { Field } from '@wordpress/dataviews';
/**
 * Internal dependencies
 */
import type { BasePost } from '../../types';
interface PostWithNotesCount extends BasePost {
    notesCount?: number;
}
declare const notesField: Field<PostWithNotesCount>;
/**
 * Notes count field for post types that support editor.notes.
 */
export default notesField;
//# sourceMappingURL=index.d.ts.map