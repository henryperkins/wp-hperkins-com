/**
 * External dependencies
 */
/**
 * WordPress dependencies
 */
import { Y } from '@wordpress/sync';
import type { WPSelection } from '../types';
export declare enum YSelectionType {
    RelativeSelection = "RelativeSelection",
    BlockSelection = "BlockSelection"
}
export interface YRelativeSelection {
    type: YSelectionType.RelativeSelection;
    attributeKey: string;
    relativePosition: Y.RelativePosition;
    clientId: string;
    offset: number;
}
export interface YBlockSelection {
    type: YSelectionType.BlockSelection;
    clientId: string;
}
export type YSelection = YRelativeSelection | YBlockSelection;
export type YFullSelection = {
    start: YSelection;
    end: YSelection;
};
export interface YSelectionHistory {
    selection: YFullSelection;
    backupSelections?: YFullSelection[];
}
export interface BlockSelectionHistory {
    getSelectionHistory: () => YFullSelection[];
    updateSelection: (newSelection: WPSelection) => void;
}
/**
 * This function is used to track recent block selections to help in restoring
 * a user's selection after an undo or redo operation.
 *
 * Maintains a history array for previous selections, which can be used for
 * backup restoration locations.
 * @param ydoc
 * @param historySize
 */
export declare function createBlockSelectionHistory(ydoc: Y.Doc, historySize?: number): BlockSelectionHistory;
//# sourceMappingURL=block-selection-history.d.ts.map