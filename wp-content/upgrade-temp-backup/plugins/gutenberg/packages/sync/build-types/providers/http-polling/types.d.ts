export type LocalAwarenessState = object | null;
export type AwarenessState = Record<string, LocalAwarenessState>;
/**
 * Update types for the sync protocol:
 * - sync_step1: State vector announcement
 * - sync_step2: Acknowledgment, missing updates response
 * - update: Regular document update (persisted until save)
 * - compaction: Merged updates using Y.mergeUpdates replacing all prior updates
 */
export declare enum SyncUpdateType {
    COMPACTION = "compaction",
    SYNC_STEP_1 = "sync_step1",
    SYNC_STEP_2 = "sync_step2",
    UPDATE = "update"
}
export interface SyncUpdate {
    data: string;
    type: SyncUpdateType;
}
interface SyncEnvelopeFromClient {
    after: number;
    awareness: LocalAwarenessState;
    client_id: number;
    room: string;
    updates: SyncUpdate[];
}
interface SyncEnvelopeFromServer {
    awareness: AwarenessState;
    compaction_request?: SyncUpdate[];
    end_cursor: number;
    should_compact?: boolean;
    room: string;
    updates: SyncUpdate[];
}
export interface SyncPayload {
    rooms: SyncEnvelopeFromClient[];
}
export interface SyncResponse {
    rooms: SyncEnvelopeFromServer[];
}
export interface UpdateQueue {
    add: (update: SyncUpdate) => void;
    addBulk: (updates: SyncUpdate[]) => void;
    clear: () => void;
    get: () => SyncUpdate[];
    pause: () => void;
    restore: (updates: SyncUpdate[]) => void;
    resume: () => void;
    size: () => number;
}
export {};
//# sourceMappingURL=types.d.ts.map