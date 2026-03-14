import { Y } from '@wordpress/sync';
/**
 * Internal dependencies
 */
import { type YMapRecord, type YMapWrap } from './crdt-utils';
interface BlockAttributes {
    [key: string]: unknown;
}
export interface Block {
    attributes: BlockAttributes;
    clientId?: string;
    innerBlocks: Block[];
    isValid?: boolean;
    name: string;
    originalContent?: string;
    validationIssues?: string[];
}
export interface YBlockRecord extends YMapRecord {
    attributes: YBlockAttributes;
    clientId: string;
    innerBlocks: YBlocks;
    isValid?: boolean;
    originalContent?: string;
    name: string;
}
export type YBlock = YMapWrap<YBlockRecord>;
export type YBlocks = Y.Array<YBlock>;
export type YBlockAttributes = Y.Map<Y.Text | unknown>;
/**
 * Merge incoming block data into the local Y.Doc.
 * This function is called to sync local block changes to a shared Y.Doc.
 *
 * @param yblocks        The blocks in the local Y.Doc.
 * @param incomingBlocks Gutenberg blocks being synced.
 * @param cursorPosition The position of the cursor after the change occurs.
 */
export declare function mergeCrdtBlocks(yblocks: YBlocks, incomingBlocks: Block[], cursorPosition: number | null): void;
/**
 * Given a Y.Text object and an updated string value, diff the new value and
 * apply the delta to the Y.Text.
 *
 * @param blockYText     The Y.Text to update.
 * @param updatedValue   The updated value.
 * @param cursorPosition The position of the cursor after the change occurs.
 */
export declare function mergeRichTextUpdate(blockYText: Y.Text, updatedValue: string, cursorPosition?: number | null): void;
export {};
//# sourceMappingURL=crdt-blocks.d.ts.map