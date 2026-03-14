import { type PostEditorAwarenessState } from '@wordpress/core-data';
import './styles/collaborators-list.scss';
interface CollaboratorsListProps {
    activeCollaborators: PostEditorAwarenessState[];
    popoverAnchor?: HTMLElement | null;
    setIsPopoverVisible: (isVisible: boolean) => void;
}
/**
 * Renders a list showing all active collaborators with their details.
 * Note: activeUsers should already exclude the current user (filtered by parent component).
 * @param props                     Component props
 * @param props.activeCollaborators List of active collaborators
 * @param props.popoverAnchor       Anchor element for the popover
 * @param props.setIsPopoverVisible Callback to set the visibility of the popover
 */
export declare function CollaboratorsList({ activeCollaborators, popoverAnchor, setIsPopoverVisible, }: CollaboratorsListProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=list.d.ts.map