import { type CRDTDoc, Y } from '@wordpress/sync';
/**
 * Internal dependencies
 */
import { type YFullSelection } from './block-selection-history';
import type { WPSelection } from '../types';
export declare function getSelectionHistory(ydoc: CRDTDoc): YFullSelection[];
export declare function updateSelectionHistory(ydoc: CRDTDoc, wpSelection: WPSelection): void;
/**
 * Restore the selection to the most recent selection in history that is
 * available in the document.
 * @param selectionHistory The selection history to restore
 * @param ydoc             The Y.Doc where blocks are stored
 */
export declare function restoreSelection(selectionHistory: YFullSelection[], ydoc: Y.Doc): void;
/**
 * If the latest selection has been shifted by remote edits, resolve and return
 * it as a WPSelection. Returns null when the history is empty or neither
 * endpoint has moved.
 *
 * @param ydoc             The Y.Doc to resolve positions against
 * @param selectionHistory The selection history to check
 * @return The shifted WPSelection, or null if nothing moved.
 */
export declare function getShiftedSelection(ydoc: Y.Doc, selectionHistory: YFullSelection[]): WPSelection | null;
//# sourceMappingURL=crdt-selection.d.ts.map