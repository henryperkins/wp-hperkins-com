import type { SyncUndoManager } from './types';
/**
 * Implementation of the WordPress UndoManager interface using YMultiDocUndoManager
 * internally. This allows undo/redo operations to be transacted against multiple
 * CRDT documents (one per entity) and giving each peer their own undo/redo stack
 * without conflicts.
 */
export declare function createUndoManager(): SyncUndoManager;
//# sourceMappingURL=undo-manager.d.ts.map