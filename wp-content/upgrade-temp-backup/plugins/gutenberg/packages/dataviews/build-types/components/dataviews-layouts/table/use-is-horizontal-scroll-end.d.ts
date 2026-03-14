/**
 * A hook to check if a given scroll container has reached the horizontal scroll end.
 *
 * The current way receives "refs" as arguments, but it lacks a mechanism to detect when a ref has changed.
 * As a result, when the "ref" is updated and attached to a new div, the computation should trigger again.
 * However, this isn't possible in the current setup because the hook is unaware that the ref has changed.
 *
 * See https://github.com/Automattic/wp-calypso/pull/103005#discussion_r2077567912.
 *
 * @param {Object}                                  params                    The parameters for the hook.
 * @param {MutableRefObject<HTMLDivElement | null>} params.scrollContainerRef The ref to the scroll container element.
 * @param {boolean}                                 [params.enabled=false]    Whether the hook is enabled.
 * @return {boolean} - Returns true if the scroll container is scrolled to the end or false otherwise.
 */
export declare function useIsHorizontalScrollEnd({ scrollContainerRef, enabled, }: {
    scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
    enabled?: boolean;
}): boolean;
//# sourceMappingURL=use-is-horizontal-scroll-end.d.ts.map