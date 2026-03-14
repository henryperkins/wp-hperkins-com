/**
 * WordPress dependencies
 */
import type { Y } from '@wordpress/sync';
/**
 * Internal dependencies
 */
import type { SelectionType } from './utils/crdt-user-selections';
export interface AnyFunction {
    (...args: any[]): any;
}
/**
 * An index path from the root of the block tree to a specific block.
 *
 * For example, `[0, 1]` refers to `blocks[0].innerBlocks[1]`.
 *
 * These paths are "absolute" in that they start from the post content root
 * (not from the template root when "Show Template" mode is active).
 * Both the Yjs document and the block-editor store share the same tree
 * structure for post content blocks, so the same path can be used to
 * navigate either tree.
 */
export type AbsoluteBlockIndexPath = number[];
/**
 * Avoid a circular dependency with @wordpress/editor
 *
 * Additionaly, this type marks `attributeKey` and `offset` as possibly
 * `undefined`, which can happen in two known scenarios:
 *
 * 1. If a user has an entire block highlighted (e.g., a `core/image` block).
 * 2. If there's an intermediate selection state while inserting a block, those
 *    properties will be temporarily`undefined`.
 */
export interface WPBlockSelection {
    clientId: string;
    attributeKey?: string;
    offset?: number;
}
export interface WPSelection {
    selectionEnd: WPBlockSelection;
    selectionStart: WPBlockSelection;
    initialPosition?: number | null;
}
/**
 * The position of the cursor.
 */
export type CursorPosition = {
    relativePosition: Y.RelativePosition;
    absoluteOffset: number;
};
export type SelectionNone = {
    type: SelectionType.None;
};
export type SelectionCursor = {
    type: SelectionType.Cursor;
    cursorPosition: CursorPosition;
};
export type SelectionInOneBlock = {
    type: SelectionType.SelectionInOneBlock;
    cursorStartPosition: CursorPosition;
    cursorEndPosition: CursorPosition;
};
export type SelectionInMultipleBlocks = {
    type: SelectionType.SelectionInMultipleBlocks;
    cursorStartPosition: CursorPosition;
    cursorEndPosition: CursorPosition;
};
export type SelectionWholeBlock = {
    type: SelectionType.WholeBlock;
    blockPosition: Y.RelativePosition;
};
export type SelectionState = SelectionNone | SelectionCursor | SelectionInOneBlock | SelectionInMultipleBlocks | SelectionWholeBlock;
//# sourceMappingURL=types.d.ts.map