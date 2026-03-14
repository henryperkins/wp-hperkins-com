/**
 * External dependencies
 */
import type * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';
/**
 * Internal dependencies
 */
import type { ProviderCreator } from '../../types';
export interface ProviderOptions {
    awareness?: Awareness;
    debug?: boolean;
    room: string;
    ydoc: Y.Doc;
}
/**
 * Create a provider creator function for the HttpPollingProvider
 */
export declare function createHttpPollingProvider(): ProviderCreator;
//# sourceMappingURL=http-polling-provider.d.ts.map