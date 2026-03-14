/**
 * Wraps a function and logs the time it takes to execute.
 *
 * @param fn - The function to be wrapped.
 */
export declare function logPerformanceTiming<Params extends Array<unknown>, ReturnType = void>(fn: (...args: Params) => ReturnType): typeof fn;
/**
 * A pass-through function that invokes the provided function with its arguments
 * without moidyfing its type.
 *
 * @param fn - The function to be invoked.
 */
export declare function passThru<T extends (...args: any[]) => any>(fn: T): T;
/**
 * Wraps a function so that every invocation is delayed until the next tick of
 * the event loop.
 *
 * @param fn - The function to be scheduled.
 */
export declare function yieldToEventLoop<Params extends Array<unknown>>(fn: (...args: Params) => void): typeof fn;
//# sourceMappingURL=performance.d.ts.map