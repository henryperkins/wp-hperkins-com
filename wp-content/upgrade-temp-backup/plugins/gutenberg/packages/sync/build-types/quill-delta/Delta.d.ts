/**
 * Internal dependencies
 */
import AttributeMap from './AttributeMap';
import Op from './Op';
import OpIterator from './OpIterator';
interface EmbedHandler<T> {
    compose: (a: T, b: T, keepNull: boolean) => T;
    invert: (a: T, b: T) => T;
    transform: (a: T, b: T, priority: boolean) => T;
}
declare class Delta {
    static Op: typeof Op;
    static OpIterator: typeof OpIterator;
    static AttributeMap: typeof AttributeMap;
    private static handlers;
    static registerEmbed<T>(embedType: string, handler: EmbedHandler<T>): void;
    static unregisterEmbed(embedType: string): void;
    private static getHandler;
    ops: Op[];
    constructor(ops?: Op[] | {
        ops: Op[];
    });
    insert(arg: string | Record<string, unknown>, attributes?: AttributeMap | null): this;
    delete(length: number): this;
    retain(length: number | Record<string, unknown>, attributes?: AttributeMap | null): this;
    push(newOp: Op): this;
    chop(): this;
    filter(predicate: (op: Op, index: number) => boolean): Op[];
    forEach(predicate: (op: Op, index: number) => void): void;
    map<T>(predicate: (op: Op, index: number) => T): T[];
    partition(predicate: (op: Op) => boolean): [Op[], Op[]];
    reduce<T>(predicate: (accum: T, curr: Op, index: number) => T, initialValue: T): T;
    changeLength(): number;
    length(): number;
    slice(start?: number, end?: number): Delta;
    compose(other: Delta): Delta;
    concat(other: Delta): Delta;
    diff(other: Delta): Delta;
    eachLine(predicate: (line: Delta, attributes: AttributeMap, index: number) => boolean | void, newline?: string): void;
    invert(base: Delta): Delta;
    transform(index: number, priority?: boolean): number;
    transform(other: Delta, priority?: boolean): Delta;
    transformPosition(index: number, priority?: boolean): number;
    /**
     * Given a Delta and a cursor position, do a diff and attempt to adjust
     * the diff to place insertions or deletions at the cursor position.
     *
     * @param other             - The other Delta to diff against.
     * @param cursorAfterChange - The cursor position index after the change.
     * @return A Delta that attempts to place insertions or deletions at the cursor position.
     */
    diffWithCursor(other: Delta, cursorAfterChange: number | null): Delta;
    /**
     * Try to move an insertion operation from after an unchanged segment to the cursor position within it.
     * This is a "look-ahead" strategy.
     *
     * @param diff              - The current unchanged diff segment.
     * @param nextDiff          - The next diff segment (expected to be an insertion).
     * @param cursorAfterChange - The cursor position after the change.
     * @param segmentStart      - The start position of the current segment.
     * @return An array of adjusted diff segments if the insertion was successfully moved, null otherwise.
     */
    private tryMoveInsertionToCursor;
    /**
     * Try to move a deletion operation to the cursor position by looking back at the previous unchanged segment.
     * This is a "look-back" strategy.
     *
     * @param diff              - The current deletion diff segment.
     * @param adjustedDiffs     - The array of previously processed diff segments.
     * @param cursorAfterChange - The cursor position after the change.
     * @param lastDiffPosition  - The position in the document up to (but not including) the current diff.
     * @return An array of adjusted diff segments if the deletion was successfully moved, null otherwise.
     */
    private tryMoveDeletionToCursor;
    /**
     * Convert two Deltas to string representations for diffing.
     *
     * @param other - The other Delta to convert.
     * @return A tuple of [thisString, otherString].
     */
    private deltasToStrings;
    /**
     * Process diff changes and convert them to Delta operations.
     *
     * @param changes   - The array of changes from the diff algorithm.
     * @param thisIter  - Iterator for this Delta's operations.
     * @param otherIter - Iterator for the other Delta's operations.
     * @return A Delta containing the processed diff operations.
     */
    private convertChangesToDelta;
}
export default Delta;
export { Op, OpIterator, AttributeMap };
//# sourceMappingURL=Delta.d.ts.map