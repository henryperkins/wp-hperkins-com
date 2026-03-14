/**
 * External dependencies
 */
import type { ComponentType } from 'react';
import type { Route } from '../../store/types';
interface RouterProps {
    routes: Route[];
    rootComponent?: ComponentType;
}
export default function Router({ routes, rootComponent, }: RouterProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=router.d.ts.map