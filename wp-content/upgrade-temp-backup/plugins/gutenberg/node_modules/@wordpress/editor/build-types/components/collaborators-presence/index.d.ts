import './styles/collaborators-presence.scss';
interface CollaboratorsPresenceProps {
    postId: number | null;
    postType: string | null;
}
/**
 * Renders a list of avatars for the active collaborators, with a maximum of 3 visible avatars.
 * Shows a popover with all collaborators on hover.
 *
 * @param props          CollaboratorsPresence component props
 * @param props.postId   ID of the post
 * @param props.postType Type of the post
 */
export declare function CollaboratorsPresence({ postId, postType, }: CollaboratorsPresenceProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=index.d.ts.map