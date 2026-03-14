import { Y } from '@wordpress/sync';
import type { AbsoluteBlockIndexPath, WPBlockSelection, SelectionState } from '../types';
/**
 * The type of selection.
 */
export declare enum SelectionType {
    None = "none",
    Cursor = "cursor",
    SelectionInOneBlock = "selection-in-one-block",
    SelectionInMultipleBlocks = "selection-in-multiple-blocks",
    WholeBlock = "whole-block"
}
/**
 * Converts WordPress block editor selection to a SelectionState.
 *
 * Uses getBlockPathForLocalClientId to locate blocks in the Yjs document by
 * their tree position (index path) rather than clientId, since clientIds may
 * differ between the block-editor store and the Yjs document (e.g. in "Show
 * Template" mode).
 *
 * @param selectionStart - The start position of the selection
 * @param selectionEnd   - The end position of the selection
 * @param yDoc           - The Yjs document
 * @return The SelectionState
 */
export declare function getSelectionState(selectionStart: WPBlockSelection, selectionEnd: WPBlockSelection, yDoc: Y.Doc): SelectionState;
/**
 * Resolves a local block-editor clientId to its index path relative to the
 * post content blocks. This allows finding the corresponding block in the Yjs
 * document even when clientIds differ (e.g. in "Show Template" mode where
 * blocks are cloned).
 *
 * In template mode, the block tree includes template parts and wrapper blocks
 * around a core/post-content block. The Yjs document only contains the post
 * content blocks, so we stop the upward walk when the parent is
 * core/post-content (its inner blocks correspond to the Yjs root blocks).
 *
 * @param clientId - The local block-editor clientId to resolve.
 * @return The index path from root, or null if not resolvable.
 */
export declare function getBlockPathForLocalClientId(clientId: string): AbsoluteBlockIndexPath | null;
/**
 * Check if two selection states are equal.
 *
 * @param selection1 - The first selection state.
 * @param selection2 - The second selection state.
 * @return True if the selection states are equal, false otherwise.
 */
export declare function areSelectionsStatesEqual(selection1: SelectionState, selection2: SelectionState): boolean;
//# sourceMappingURL=crdt-user-selections.d.ts.map