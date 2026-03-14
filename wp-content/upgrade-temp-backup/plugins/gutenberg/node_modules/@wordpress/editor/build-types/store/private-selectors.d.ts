export function getListViewToggleRef(state: any): any;
export function getInserterSidebarToggleRef(state: any): any;
export function getEntityActions(state: any, ...args: any[]): import("@wordpress/dataviews").Action<any>[];
export function isEntityReady(state: any, ...args: any[]): boolean;
export function getEntityFields(state: any, ...args: any[]): import("@wordpress/dataviews").Field<any>[];
/**
 * Get the current global styles navigation path.
 *
 * @param {Object} state Global application state.
 * @return {string} The current styles path.
 */
export function getStylesPath(state: Object): string;
/**
 * Get whether the stylebook is currently visible.
 *
 * @param {Object} state Global application state.
 * @return {boolean} Whether the stylebook is visible.
 */
export function getShowStylebook(state: Object): boolean;
/**
 * Get the canvas minimum height.
 *
 * @param {Object} state Global application state.
 * @return {number} The canvas minimum height.
 */
export function getCanvasMinHeight(state: Object): number;
/**
 * Returns whether the editor is in revisions preview mode.
 *
 * @param {Object} state Global application state.
 * @return {boolean} Whether revisions mode is active.
 */
export function isRevisionsMode(state: Object): boolean;
/**
 * Returns the current revision ID in revisions mode.
 *
 * @param {Object} state Global application state.
 * @return {number|null} The revision ID, or null if not in revisions mode.
 */
export function getCurrentRevisionId(state: Object): number | null;
/**
 * Returns the currently selected note ID.
 *
 * @param {Object} state Global application state.
 *
 * @return {undefined|number|'new'} The selected note ID, 'new' for the new note form, or undefined if none.
 */
export function getSelectedNote(state: Object): undefined | number | "new";
/**
 * Returns whether the selected note should be focused.
 *
 * @param {Object} state Global application state.
 *
 * @return {boolean} Whether the selected note should be focused.
 */
export function isNoteFocused(state: Object): boolean;
/**
 * Get the inserter.
 *
 * @param {Object} state Global application state.
 *
 * @return {Object} The root client ID, index to insert at and starting filter value.
 */
export const getInserter: {
    (state: any): any;
    isRegistrySelector?: boolean;
    registry?: any;
};
export const getPostIcon: {
    (state: any, postType: any, options: any): any;
    isRegistrySelector?: boolean;
    registry?: any;
};
/**
 * Returns true if there are unsaved changes to the
 * post's meta fields, and false otherwise.
 *
 * @param {Object} state    Global application state.
 * @param {string} postType The post type of the post.
 * @param {number} postId   The ID of the post.
 *
 * @return {boolean} Whether there are edits or not in the meta fields of the relevant post.
 */
export const hasPostMetaChanges: {
    (state: any, postType: any, postId: any): boolean;
    isRegistrySelector?: boolean;
    registry?: any;
};
/**
 * Similar to getBlocksByName in @wordpress/block-editor, but only returns the top-most
 * blocks that aren't descendants of the query block.
 *
 * @param {Object}       state      Global application state.
 * @param {Array|string} blockNames Block names of the blocks to retrieve.
 *
 * @return {Array} Block client IDs.
 */
export const getPostBlocksByName: {
    (state: any, blockNames: any): any;
    isRegistrySelector?: boolean;
    registry?: any;
};
/**
 * Returns the default rendering mode for a post type by user preference or post type configuration.
 *
 * @param {Object} state    Global application state.
 * @param {string} postType The post type.
 *
 * @return {string} The default rendering mode. Returns `undefined` while resolving value.
 */
export const getDefaultRenderingMode: {
    (state: any, postType: any): any;
    isRegistrySelector?: boolean;
    registry?: any;
};
/**
 * Returns the current revision object in revisions mode.
 *
 * @param {Object} state Global application state.
 * @return {Object|null|undefined} The revision object, null if loading, or undefined if not in revisions mode.
 */
export const getCurrentRevision: {
    (state: any): Record<import("@wordpress/core-data").Context, Record<number, import("@wordpress/core-data").PostRevision<"view">>> | Record<import("@wordpress/core-data").Context, Record<number, import("@wordpress/core-data").GlobalStylesRevision<"view">>> | null | undefined;
    isRegistrySelector?: boolean;
    registry?: any;
};
/**
 * Returns the previous revision (the one before the current revision).
 * Used for diffing between revisions.
 *
 * @param {Object} state Global application state.
 * @return {Object|null|undefined} The previous revision object, null if loading or no previous revision, or undefined if not in revisions mode.
 */
export const getPreviousRevision: {
    (state: any): Record<import("@wordpress/core-data").Context, Record<number, import("@wordpress/core-data").PostRevision<"view">>> | Record<import("@wordpress/core-data").Context, Record<number, import("@wordpress/core-data").GlobalStylesRevision<"view">>> | null | undefined;
    isRegistrySelector?: boolean;
    registry?: any;
};
//# sourceMappingURL=private-selectors.d.ts.map