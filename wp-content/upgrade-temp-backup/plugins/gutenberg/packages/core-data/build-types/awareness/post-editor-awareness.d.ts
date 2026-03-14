import { Y } from '@wordpress/sync';
/**
 * Internal dependencies
 */
import { BaseAwarenessState } from './base-awareness';
import type { SelectionState } from '../types';
import type { EditorState, PostEditorState, YDocDebugData } from './types';
export declare class PostEditorAwareness extends BaseAwarenessState<PostEditorState> {
    private kind;
    private name;
    private postId;
    protected equalityFieldChecks: {
        editorState: (state1?: EditorState, state2?: EditorState) => boolean;
        collaboratorInfo: typeof import("./utils").areCollaboratorInfosEqual;
    };
    constructor(doc: Y.Doc, kind: string, name: string, postId: number);
    protected onSetUp(): void;
    /**
     * Subscribe to collaborator selection changes and update the selection state.
     */
    private subscribeToCollaboratorSelectionChanges;
    /**
     * Update the entity record with the current collaborator's selection.
     *
     * @param selectionStart  - The start position of the selection.
     * @param selectionEnd    - The end position of the selection.
     * @param initialPosition - The initial position of the selection.
     */
    private updateSelectionInEntityRecord;
    /**
     * Check if two editor states are equal.
     *
     * @param state1 - The first editor state.
     * @param state2 - The second editor state.
     * @return True if the editor states are equal, false otherwise.
     */
    private areEditorStatesEqual;
    /**
     * Resolve a selection state to a text index and block client ID.
     *
     * For text-based selections, navigates up from the resolved Y.Text via
     * AbstractType.parent to find the containing block, then resolves the
     * local clientId via the block's tree path.
     * For WholeBlock selections, resolves the block's relative position and
     * then finds the local clientId via tree path.
     *
     * Tree-path resolution is used instead of reading the clientId directly
     * from the Yjs block because the local block-editor store may use different
     * clientIds (e.g. in "Show Template" mode where blocks are cloned).
     *
     * @param selection - The selection state.
     * @return The text index and block client ID, or nulls if not resolvable.
     */
    convertSelectionStateToAbsolute(selection: SelectionState): {
        textIndex: number | null;
        localClientId: string | null;
    };
    /**
     * Type guard to check if a struct is a Y.Item (not Y.GC)
     * @param struct - The struct to check.
     * @return True if the struct is a Y.Item, false otherwise.
     */
    private isYItem;
    /**
     * Get data for debugging, using the awareness state.
     *
     * @return {YDocDebugData} The debug data.
     */
    getDebugData(): YDocDebugData;
}
//# sourceMappingURL=post-editor-awareness.d.ts.map