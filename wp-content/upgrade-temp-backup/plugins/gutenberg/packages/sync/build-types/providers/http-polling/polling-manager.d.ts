/**
 * External dependencies
 */
import * as Y from 'yjs';
import type { Awareness } from 'y-protocols/awareness';
/**
 * Internal dependencies
 */
import type { ConnectionStatus } from '../../types';
type LogFunction = (message: string, debug?: object) => void;
interface PollingManager {
    registerRoom: (options: RegisterRoomOptions) => void;
    retryNow: () => void;
    unregisterRoom: (room: string) => void;
}
interface RegisterRoomOptions {
    room: string;
    doc: Y.Doc;
    awareness: Awareness;
    log: LogFunction;
    onStatusChange: (status: ConnectionStatus) => void;
    onSync: () => void;
}
export declare const pollingManager: PollingManager;
export {};
//# sourceMappingURL=polling-manager.d.ts.map