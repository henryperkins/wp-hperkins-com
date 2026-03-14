import type { View } from '@wordpress/dataviews';
import type { ViewConfig } from './types';
/**
 * Async function for loading view state in route loaders.
 *
 * @param config                     Configuration object for loading the view.
 * @param config.kind                Entity kind (e.g., 'postType', 'taxonomy', 'root').
 * @param config.name                Specific entity name.
 * @param config.slug                View identifier.
 * @param config.defaultView         Default view configuration.
 * @param config.activeViewOverrides View overrides applied on top but never persisted.
 * @param config.queryParams         Object with `page` and/or `search` from URL.
 * @return Promise resolving to the loaded view object.
 */
export declare function loadView(config: ViewConfig): Promise<View>;
//# sourceMappingURL=load-view.d.ts.map