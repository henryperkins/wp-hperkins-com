/**
 * External dependencies
 */
import RouteRecognizer from 'route-recognizer';
/**
 * Internal dependencies
 */
import type { ReactNode } from 'react';
interface Route {
    name: string;
    path: string;
    areas: Record<string, ReactNode>;
    widths: Record<string, number>;
}
type LocationWithQuery = Location & {
    query?: Record<string, any>;
};
interface Match {
    name: string;
    path: string;
    areas: Record<string, ReactNode>;
    widths: Record<string, number>;
    query?: Record<string, any>;
    params?: Record<string, any>;
}
export type BeforeNavigate = (arg: {
    path: string;
    query: Record<string, any>;
}) => {
    path: string;
    query: Record<string, any>;
};
interface Config {
    pathArg: string;
    beforeNavigate?: BeforeNavigate;
}
export interface NavigationOptions {
    transition?: string;
    state?: Record<string, any>;
}
export declare const ConfigContext: import("react").Context<Config>;
export declare function useLocation(): Match;
export declare function useHistory(): {
    navigate: (rawPath: string, options?: NavigationOptions) => Promise<void>;
    back: () => void;
    invalidate: () => void;
};
export default function useMatch(location: LocationWithQuery, matcher: RouteRecognizer, pathArg: string, matchResolverArgs: Record<string, any>): Match | undefined;
export declare function RouterProvider({ routes, pathArg, beforeNavigate, children, matchResolverArgs, }: {
    routes: Route[];
    pathArg: string;
    beforeNavigate?: BeforeNavigate;
    children: React.ReactNode;
    matchResolverArgs: Record<string, any>;
}): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=router.d.ts.map