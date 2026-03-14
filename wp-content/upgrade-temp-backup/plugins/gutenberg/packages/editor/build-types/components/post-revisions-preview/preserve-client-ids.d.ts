/**
 * Preserves clientIds from previously rendered blocks to prevent flashing.
 * Uses LCS algorithm to match blocks by name.
 *
 * This compares the newly parsed blocks against the last rendered blocks
 * to maintain React key stability.
 *
 * @param {Array} newBlocks  Newly parsed blocks with fresh clientIds.
 * @param {Array} prevBlocks Previously rendered blocks with stable clientIds.
 * @return {Array} Blocks with preserved clientIds where possible.
 */
export function preserveClientIds(newBlocks: any[], prevBlocks: any[]): any[];
//# sourceMappingURL=preserve-client-ids.d.ts.map