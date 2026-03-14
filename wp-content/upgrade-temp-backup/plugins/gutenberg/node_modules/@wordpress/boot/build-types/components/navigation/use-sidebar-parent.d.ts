/**
 * The `useSidebarParent` hook returns the ID of the parent menu item
 * to render in the sidebar based on the current route.
 *
 * - It finds the closest matching menu item when exact path matches fail
 * - It allows the user to navigate in the sidebar (local state) without changing the URL.
 * - If the URL changes, it will update the parent ID to ensure the correct drilldown level is displayed.
 *
 * @return The ID of the parent menu item to render in the sidebar.
 */
export declare function useSidebarParent(): readonly [string | undefined, import("react").Dispatch<import("react").SetStateAction<string | undefined>>, string | undefined, import("react").Dispatch<import("react").SetStateAction<string | undefined>>];
//# sourceMappingURL=use-sidebar-parent.d.ts.map