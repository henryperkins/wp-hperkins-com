/**
 * Internal dependencies
 */
import type { BasePost } from '../types';
interface RenderModalProps<Item> {
    items: Item[];
    closeModal?: () => void;
    onActionPerformed?: (items: Item[]) => void;
}
interface Action<Item> {
    id: string;
    label: string;
    isEligible?: (item: Item) => boolean;
    modalFocusOnMount?: string;
    RenderModal: (props: RenderModalProps<Item>) => React.JSX.Element;
}
declare const reorderPage: Action<BasePost>;
/**
 * Reorder action for BasePost.
 */
export default reorderPage;
//# sourceMappingURL=reorder-page.d.ts.map