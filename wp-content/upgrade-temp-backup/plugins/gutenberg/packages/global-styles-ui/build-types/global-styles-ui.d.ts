import type { GlobalStylesConfig } from '@wordpress/global-styles-engine';
interface GlobalStylesUIProps {
    /** User global styles object (what gets edited) */
    value: GlobalStylesConfig;
    /** Base global styles object (theme default) */
    baseValue: GlobalStylesConfig;
    /** Callback when global styles change */
    onChange: (newValue: GlobalStylesConfig) => void;
    /** Current navigation path (optional) */
    path?: string;
    /** Callback when navigation path changes (optional) */
    onPathChange?: (path: string) => void;
    /** Whether font library is enabled (optional) */
    fontLibraryEnabled?: boolean;
    /** Server CSS styles for BlockEditorProvider (optional) */
    serverCSS?: {
        isGlobalStyles?: boolean;
    }[];
    /** Server settings for BlockEditorProvider (optional) */
    serverSettings?: {
        __unstableResolvedAssets: Record<string, unknown>;
    };
}
export declare function GlobalStylesUI({ value, baseValue, onChange, path, onPathChange, fontLibraryEnabled, serverCSS, serverSettings, }: GlobalStylesUIProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=global-styles-ui.d.ts.map