import type { SyncManager } from './types';
/**
 * The sync manager orchestrates the lifecycle of syncing entity records. It
 * creates Yjs documents, connects to providers, creates awareness instances,
 * and coordinates with the `core-data` store.
 *
 * @param debug Whether to enable performance and debug logging.
 */
export declare function createSyncManager(debug?: boolean): SyncManager;
//# sourceMappingURL=manager.d.ts.map