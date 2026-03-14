/**
 * Internal dependencies
 */
import type { MenuItem } from '../../store/types';
/**
 * Finds the menu item that is the closest parent of the current path.
 * Only considers menu items that have a 'to' path defined and are valid parents.
 *
 * @param currentPath - Current page path
 * @param menuItems   - Array of all menu items
 * @return Menu item that is the closest parent, or null if no valid parent found
 */
export declare const findClosestMenuItem: (currentPath: string, menuItems: MenuItem[]) => MenuItem | null;
/**
 * Finds the drilldown parent of a menu item by traversing up the menu tree.
 *
 * @param id        - The ID of the menu item to find the drilldown parent for
 * @param menuItems - Array of all menu items
 * @return The ID of the drilldown parent, or undefined if none found
 */
export declare const findDrilldownParent: (id: string | undefined, menuItems: MenuItem[]) => string | undefined;
/**
 * Finds the dropdown parent of a menu item.
 *
 * @param id        - The ID of the menu item to find the dropdown parent for
 * @param menuItems - Array of all menu items
 * @return The ID of the dropdown parent, or undefined if none found
 */
export declare const findDropdownParent: (id: string | undefined, menuItems: MenuItem[]) => string | undefined;
//# sourceMappingURL=path-matching.d.ts.map