import { Y } from '@wordpress/sync';
/**
 * Internal dependencies
 */
import type { AbsoluteBlockIndexPath } from '../types';
/**
 * Given a Y.Map within a Ydoc, traverse up the Yjs block tree to compute the
 * index path from the root.
 *
 * For example, the second inner block of the first root block returns [0, 1].
 *
 * @param yType - The Yjs block Y.Map to start from.
 * @return The index path from root, or null if traversal fails.
 */
export declare function getBlockPathInYdoc(yType: Y.Map<unknown>): AbsoluteBlockIndexPath | null;
/**
 * Navigate the block-editor store's block tree by an index path
 * and return the local block's clientId.
 *
 * In template mode, getBlocks() returns the full template tree, but Yjs
 * paths are relative to the post content. This method finds the
 * core/post-content block (if present) and uses its inner blocks as the
 * navigation root, so paths align with the Yjs document structure.
 *
 * @param path - The index path, e.g. [0, 1] for blocks[0].innerBlocks[1].
 * @return The local block clientId, or null if the path is invalid.
 */
export declare function resolveBlockClientIdByPath(path: AbsoluteBlockIndexPath): string | null;
//# sourceMappingURL=block-lookup.d.ts.map