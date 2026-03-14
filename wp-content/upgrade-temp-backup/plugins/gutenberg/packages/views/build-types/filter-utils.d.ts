/**
 * WordPress dependencies
 */
import type { View } from '@wordpress/dataviews';
/**
 * Internal dependencies
 */
import type { ActiveViewOverrides } from './types';
/**
 * Merges activeViewOverrides into a view.
 * Filters: Active filters take precedence; same-field filters are replaced.
 * Sort: Active sort is applied only if current sort matches the default.
 *
 * @param view                The view to merge overrides into.
 * @param activeViewOverrides The tab-specific overrides to apply.
 * @param defaultView         The default view configuration.
 * @return A new view with merged overrides, or the original view if no overrides.
 */
export declare function mergeActiveViewOverrides(view: View, activeViewOverrides?: ActiveViewOverrides, defaultView?: View): View;
/**
 * Strips overrides before persisting.
 * Filters: Removes filters on fields managed by activeViewOverrides.
 * Sort: If sort matches the override, restores the default sort.
 *
 * @param view                The view to strip overrides from.
 * @param activeViewOverrides The tab-specific override definitions.
 * @param defaultView         The default view configuration.
 * @return A new view with overrides stripped, or the original view if no overrides.
 */
export declare function stripActiveViewOverrides(view: View, activeViewOverrides?: ActiveViewOverrides, defaultView?: View): View;
//# sourceMappingURL=filter-utils.d.ts.map