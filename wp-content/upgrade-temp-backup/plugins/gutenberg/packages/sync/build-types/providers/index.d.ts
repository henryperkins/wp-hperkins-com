import type { ProviderCreator } from '../types';
/**
 * Returns the defeault provider creators. HTTP polling is the current default
 * provider.
 *
 * @return {ProviderCreator[]} Creator functions for Yjs providers.
 */
export declare function getDefaultProviderCreators(): ProviderCreator[];
/**
 * Get the current Yjs provider creators, allowing plugins to filter the array.
 *
 * @return {ProviderCreator[]} Creator functions for Yjs providers.
 */
export declare function getProviderCreators(): ProviderCreator[];
//# sourceMappingURL=index.d.ts.map