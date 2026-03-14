/**
 * Internal dependencies
 */
import { type SyncPayload, type SyncResponse, type SyncUpdate, SyncUpdateType, type UpdateQueue } from './types';
export declare function uint8ArrayToBase64(data: Uint8Array): string;
export declare function base64ToUint8Array(base64: string): Uint8Array;
export declare function createSyncUpdate(data: Uint8Array, type: SyncUpdateType): SyncUpdate;
export declare function createUpdateQueue(initial?: SyncUpdate[], paused?: boolean): UpdateQueue;
/**
 * Post a sync update and receive updates the client is missing.
 *
 * @param payload The sync payload including data and after cursor
 * @return The sync server response
 */
export declare function postSyncUpdate(payload: SyncPayload): Promise<SyncResponse>;
/**
 * Fire-and-forget variant of postSyncUpdate. Uses `keepalive` so the
 * request survives page unload, and errors are silently ignored.
 *
 * @param payload The sync payload to send.
 */
export declare function postSyncUpdateNonBlocking(payload: SyncPayload): void;
//# sourceMappingURL=utils.d.ts.map