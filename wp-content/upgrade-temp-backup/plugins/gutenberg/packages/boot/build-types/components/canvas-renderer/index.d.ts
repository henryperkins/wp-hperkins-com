import type { CanvasData } from '../../store/types';
interface CanvasRendererProps {
    canvas: CanvasData | null | undefined;
    routeContentModule?: string;
}
/**
 * CanvasRenderer handles rendering of both default and custom canvas components.
 * The logic here would have been way simpler if we just render the canvas within
 * the RouteComponent like the other surfaces.
 * The issue is that doing so forces the canvas to remount on every route change,
 * which is not desirable for smooth transitions.
 *
 * - When canvas is undefined: No canvas is rendered
 * - When canvas is null: Loads and renders custom canvas from contentModulePath
 * - When canvas is CanvasData: Renders default Canvas component with editor
 *
 * This component is designed to be rendered at the Root level to prevent
 * remounting when navigating between routes.
 *
 * @param props                    Component props
 * @param props.canvas             Canvas data from route loader
 * @param props.routeContentModule Path to content module for custom canvas
 * @return Canvas renderer
 */
export default function CanvasRenderer({ canvas, routeContentModule, }: CanvasRendererProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=index.d.ts.map