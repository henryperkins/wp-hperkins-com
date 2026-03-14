import type { View } from '@wordpress/dataviews';
import type { ViewConfig } from './types';
interface UseViewReturn {
    view: View;
    isModified: boolean;
    updateView: (newView: View) => void;
    resetToDefault: () => void;
}
/**
 * Hook for managing DataViews view state with local persistence.
 *
 * @param config Configuration object for loading the view.
 *
 * @return Object with current view, modification state, and update functions.
 */
export declare function useView(config: ViewConfig): UseViewReturn;
export {};
//# sourceMappingURL=use-view.d.ts.map