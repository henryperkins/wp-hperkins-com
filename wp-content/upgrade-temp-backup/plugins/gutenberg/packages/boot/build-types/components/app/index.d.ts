import type { MenuItem, Route } from '../../store/types';
export declare function init({ mountId, menuItems, routes, initModules, dashboardLink, }: {
    mountId: string;
    menuItems?: MenuItem[];
    routes?: Route[];
    initModules?: string[];
    dashboardLink?: string;
}): Promise<void>;
export declare function initSinglePage({ mountId, routes, }: {
    mountId: string;
    routes?: Route[];
}): Promise<void>;
//# sourceMappingURL=index.d.ts.map