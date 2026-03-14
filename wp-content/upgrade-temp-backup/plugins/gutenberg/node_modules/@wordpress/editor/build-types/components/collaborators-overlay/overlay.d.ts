interface OverlayProps {
    blockEditorDocument?: Document;
    postId: number | null;
    postType: string | null;
}
/**
 * This component is responsible for rendering the overlay components within the editor iframe.
 *
 * @param props                     - The overlay props.
 * @param props.blockEditorDocument - The block editor document.
 * @param props.postId              - The ID of the post.
 * @param props.postType            - The type of the post.
 * @return The Overlay component.
 */
export declare function Overlay({ blockEditorDocument, postId, postType, }: OverlayProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=overlay.d.ts.map