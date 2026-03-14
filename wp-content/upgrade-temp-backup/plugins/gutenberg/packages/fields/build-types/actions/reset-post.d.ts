import type { Action } from '@wordpress/dataviews';
import type { Template, TemplatePart } from '../types';
declare global {
    interface Window {
        __experimentalTemplateActivate?: boolean;
    }
}
declare const resetPostAction: Action<Template | TemplatePart>;
/**
 * Reset action for Template and TemplatePart.
 */
export default resetPostAction;
//# sourceMappingURL=reset-post.d.ts.map