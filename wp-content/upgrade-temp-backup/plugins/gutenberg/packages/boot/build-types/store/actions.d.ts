/**
 * Internal dependencies
 */
import type { MenuItem, Route } from './types';
export declare function registerMenuItem(id: string, menuItem: MenuItem): {
    type: "REGISTER_MENU_ITEM";
    id: string;
    menuItem: MenuItem;
};
export declare function updateMenuItem(id: string, updates: Partial<MenuItem>): {
    type: "UPDATE_MENU_ITEM";
    id: string;
    updates: Partial<MenuItem>;
};
export declare function registerRoute(route: Route): {
    type: "REGISTER_ROUTE";
    route: Route;
};
export declare function setDashboardLink(dashboardLink: string): {
    type: "SET_DASHBOARD_LINK";
    dashboardLink: string;
};
export type Action = ReturnType<typeof registerMenuItem> | ReturnType<typeof updateMenuItem> | ReturnType<typeof registerRoute> | ReturnType<typeof setDashboardLink>;
//# sourceMappingURL=actions.d.ts.map