/**
 * WordPress dependencies
 */
import type { GlobalStylesConfig } from '@wordpress/global-styles-engine';
interface GlobalStylesProviderProps {
    value: GlobalStylesConfig;
    baseValue: GlobalStylesConfig;
    onChange: (config: GlobalStylesConfig) => void;
}
/**
 * Higher-order component that wraps a component with GlobalStylesProvider.
 * This allows components to access GlobalStylesContext without exposing
 * the provider directly in the public API.
 *
 * @param Component - The component to wrap
 * @return A wrapped component that accepts value, baseValue, and onChange props
 */
export declare function withGlobalStylesProvider<P extends object>(Component: React.ComponentType<P>): ({ value, baseValue, onChange, ...props }: P & GlobalStylesProviderProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=with-global-styles-provider.d.ts.map