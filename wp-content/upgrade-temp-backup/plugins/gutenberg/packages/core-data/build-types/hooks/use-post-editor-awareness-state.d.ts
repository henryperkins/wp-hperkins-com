import type { PostEditorAwarenessState as ActiveCollaborator, PostSaveEvent, YDocDebugData } from '../awareness/types';
import type { SelectionState } from '../types';
interface ResolvedSelection {
    textIndex: number | null;
    localClientId: string | null;
}
/**
 * Hook to get the active collaborators for a post editor.
 *
 * @param  postId   - The ID of the post.
 * @param  postType - The type of the post.
 * @return {ActiveCollaborator[]} The active collaborators.
 */
export declare function useActiveCollaborators(postId: number | null, postType: string | null): ActiveCollaborator[];
/**
 * Hook to resolve a selection state to a text index and block client ID.
 *
 * @param postId   - The ID of the post.
 * @param postType - The type of the post.
 * @return A function that resolves a selection to its text index and block client ID.
 */
export declare function useResolvedSelection(postId: number | null, postType: string | null): (selection: SelectionState) => ResolvedSelection;
/**
 * Hook to get data for debugging, using the awareness state.
 *
 * @param  postId   - The ID of the post.
 * @param  postType - The type of the post.
 * @return {YDocDebugData} The debug data.
 */
export declare function useGetDebugData(postId: number | null, postType: string | null): YDocDebugData;
/**
 * Hook to check if the current collaborator is disconnected.
 *
 * @param  postId   - The ID of the post.
 * @param  postType - The type of the post.
 * @return {boolean} Whether the current collaborator is disconnected.
 */
export declare function useIsDisconnected(postId: number | null, postType: string | null): boolean;
/**
 * Hook that subscribes to the CRDT state map and returns the most recent
 * save event (timestamp + client ID). The state map is updated by
 * `markEntityAsSaved` in `@wordpress/sync`
 *
 * @param postId   The ID of the post.
 * @param postType The type of the post.
 */
export declare function useLastPostSave(postId: number | null, postType: string | null): PostSaveEvent | null;
export {};
//# sourceMappingURL=use-post-editor-awareness-state.d.ts.map