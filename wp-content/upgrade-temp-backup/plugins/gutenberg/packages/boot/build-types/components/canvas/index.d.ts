/**
 * Internal dependencies
 */
import type { CanvasData } from '../../store/types';
interface CanvasProps {
    canvas: CanvasData;
}
/**
 * Canvas component that dynamically loads and renders the lazy editor.
 *
 * @param {Object} props        - Component props
 * @param {Object} props.canvas - Canvas data containing postType and postId
 * @return Canvas surface with editor
 */
export default function Canvas({ canvas }: CanvasProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map