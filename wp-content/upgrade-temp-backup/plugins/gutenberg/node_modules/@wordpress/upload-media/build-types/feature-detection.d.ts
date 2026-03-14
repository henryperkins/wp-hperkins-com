/**
 * Result of client-side media processing support detection.
 */
export interface FeatureDetectionResult {
    /**
     * Whether client-side media processing is supported.
     */
    supported: boolean;
    /**
     * Reason why client-side media processing is not supported (if applicable).
     */
    reason?: string;
}
/**
 * Detects whether the browser supports client-side media processing.
 *
 * This checks for:
 * 1. WebAssembly support (required for wasm-vips)
 * 2. SharedArrayBuffer support (required for WASM threading)
 * 3. CSP compatibility for blob URL workers (required for inline worker creation)
 * 4. Device memory (disables on devices with ≤2 GB RAM)
 * 5. Hardware concurrency (disables on devices with fewer than 4 CPU cores)
 * 6. Network conditions (disables when data saver / reduced data mode is on or connection is 3g/2g/slow-2g)
 * 7. Web Worker support (baseline requirement)
 *
 * Results are cached after the first call. Use `clearFeatureDetectionCache()` to reset.
 *
 * @return Feature detection result with supported status and reason if not supported.
 */
export declare function detectClientSideMediaSupport(): FeatureDetectionResult;
/**
 * Returns whether client-side media processing is supported.
 *
 * This is a convenience function that returns just the boolean result.
 *
 * @return Whether client-side media processing is supported.
 */
export declare function isClientSideMediaSupported(): boolean;
/**
 * Clears the cached feature detection result.
 *
 * This is primarily useful for testing purposes.
 */
export declare function clearFeatureDetectionCache(): void;
//# sourceMappingURL=feature-detection.d.ts.map