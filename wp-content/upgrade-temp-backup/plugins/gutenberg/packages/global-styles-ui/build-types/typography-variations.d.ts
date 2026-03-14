/**
 * WordPress dependencies
 */
import type { GlobalStylesConfig } from '@wordpress/global-styles-engine';
export interface TypographyVariationsProps {
    value: GlobalStylesConfig;
    baseValue: GlobalStylesConfig;
    onChange: (config: GlobalStylesConfig) => void;
    title?: string;
    gap?: number;
}
/**
 * Render Typography Variations.
 *
 * @example
 * ```tsx
 * <TypographyVariations
 *   value={userConfig}
 *   baseValue={baseConfig}
 *   onChange={setUserConfig}
 *   title="Typography"
 *   gap={3}
 * />
 * ```
 */
export declare const TypographyVariations: React.ComponentType<TypographyVariationsProps>;
//# sourceMappingURL=typography-variations.d.ts.map