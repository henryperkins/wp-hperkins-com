/**
 * Internal dependencies
 */
import type { IconType } from '../../store/types';
/**
 * Converts the given IconType into a renderable component:
 * - Dashicon string into a Dashicon component
 * - JSX SVG element into an Icon component
 * - Data URL into an img element
 *
 * @param icon                  - The icon to convert
 * @param shouldShowPlaceholder - Whether to show placeholder when no icon is provided
 * @return The converted icon as a JSX element
 */
export declare function wrapIcon(icon?: IconType, shouldShowPlaceholder?: boolean): string | number | true | import("react").JSX.Element | Iterable<import("react").ReactNode> | null;
//# sourceMappingURL=items.d.ts.map