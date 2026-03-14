/**
 * External dependencies
 */
import type { ReactNode } from 'react';
interface EditorProps {
    postType?: string;
    postId?: string;
    settings?: Record<string, any>;
    backButton?: ReactNode;
}
/**
 * Lazy-loading editor component that handles asset loading and settings initialization.
 *
 * @param {Object}    props            Component props
 * @param {string}    props.postType   Optional post type to edit. If not provided, resolves to homepage.
 * @param {string}    props.postId     Optional post ID to edit. If not provided, resolves to homepage.
 * @param {Object}    props.settings   Optional extra settings to merge with editor settings
 * @param {ReactNode} props.backButton Optional back button to render in editor header
 * @return The editor component with loading states
 */
export declare function Editor({ postType, postId, settings, backButton, }: EditorProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map