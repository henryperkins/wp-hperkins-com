/**
 * External dependencies
 */
import type { ReactNode } from 'react';
import type { GlobalStylesConfig } from '@wordpress/global-styles-engine';
interface GlobalStylesProviderProps {
    children: ReactNode;
    value: GlobalStylesConfig;
    baseValue: GlobalStylesConfig;
    onChange: (newValue: GlobalStylesConfig) => void;
    fontLibraryEnabled?: boolean;
}
export declare function GlobalStylesProvider({ children, value, baseValue, onChange, fontLibraryEnabled, }: GlobalStylesProviderProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=provider.d.ts.map