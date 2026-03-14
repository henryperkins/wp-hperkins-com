/**
 * Internal dependencies
 */
import { type Remote } from './types';
/**
 * Wraps a Worker to provide a type-safe RPC interface.
 *
 * The returned proxy object allows calling methods on the worker as if they
 * were local async functions. Each method call is automatically serialized,
 * sent to the worker, and the result is returned as a Promise.
 *
 * @example
 * ```typescript
 * const worker = new Worker(new URL('./worker.js', import.meta.url));
 * const api = wrap<MyWorkerAPI>(worker);
 *
 * // Call worker methods as async functions
 * const result = await api.processData(data);
 * ```
 *
 * @param worker - The Worker instance to wrap.
 * @return A proxy object with all exposed methods as async functions.
 */
export declare function wrap<T extends object>(worker: Worker): Remote<T>;
/**
 * Terminates a wrapped worker and cleans up resources.
 *
 * After calling terminate, any pending calls will be rejected and the
 * worker will be stopped.
 *
 * @example
 * ```typescript
 * const api = wrap<MyWorkerAPI>(worker);
 * // ... use the API ...
 * terminate(api); // Clean up when done
 * ```
 *
 * @param remote - The wrapped worker proxy returned by wrap().
 */
export declare function terminate(remote: Remote<unknown>): void;
//# sourceMappingURL=main-thread.d.ts.map