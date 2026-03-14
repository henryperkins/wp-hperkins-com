export interface CursorData {
    userName: string;
    clientId: number;
    color: string;
    avatarUrl?: string;
    x: number;
    y: number;
    height: number;
}
/**
 * Custom hook that computes cursor positions for each remote user in the editor.
 *
 * @param overlayElement      - The overlay element
 * @param blockEditorDocument - The block editor document
 * @param postId              - The ID of the post
 * @param postType            - The type of the post
 * @return An array of cursor data for rendering, and a function to trigger a delayed recompute.
 */
export declare function useRenderCursors(overlayElement: HTMLElement | null, blockEditorDocument: Document | null, postId: number | null, postType: string | null): {
    cursors: CursorData[];
    rerenderCursorsAfterDelay: () => () => void;
};
//# sourceMappingURL=use-render-cursors.d.ts.map