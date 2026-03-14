import type { GlobalStylesConfig } from '@wordpress/global-styles-engine';
export interface GlobalStylesContextType {
    user: GlobalStylesConfig;
    base: GlobalStylesConfig;
    merged: GlobalStylesConfig;
    onChange: (newValue: GlobalStylesConfig) => void;
    fontLibraryEnabled?: boolean;
}
export declare const GlobalStylesContext: import("react").Context<GlobalStylesContextType>;
//# sourceMappingURL=context.d.ts.map