/**
 * Hook to get merged global styles configuration
 *
 * @return {Object} Object containing merged, base, user configs and setUser function
 *                  { merged, base, user, setUser }
 */
export function useGlobalStyles(): Object;
/**
 * Hook to get a style value from global styles
 *
 * @param {string}  path      Style path (e.g., 'color.background')
 * @param {string=} blockName Optional block name
 * @return {*} Style value
 */
export function useStyle(path: string, blockName?: string | undefined): any;
/**
 * Hook to get a setting value from global styles
 *
 * @param {string}  path      Setting path (e.g., 'spacing.blockGap')
 * @param {string=} blockName Optional block name
 * @return {*} Setting value
 */
export function useSetting(path: string, blockName?: string | undefined): any;
//# sourceMappingURL=hooks.d.ts.map