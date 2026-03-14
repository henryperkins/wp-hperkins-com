/**
 * Hook that computes a countdown in seconds from a retryInMs value.
 *
 * @param {number|undefined} retryInMs Milliseconds until next retry.
 * @param {string|undefined} status    Current connection status.
 * @return {Object} Object with `secondsRemaining` (number|null) and `markRetrying` callback.
 */
export function useRetryCountdown(retryInMs: number | undefined, status: string | undefined): Object;
//# sourceMappingURL=use-retry-countdown.d.ts.map