/**
 * Internal dependencies
 */
import { type State } from './selectors';
type EntityRecordKey = string | number;
/**
 * Returns the previous edit from the current undo offset
 * for the entity records edits history, if any.
 *
 * Known Issue: Every-time state.undoManager changes, the getUndoManager
 * private selector is called (if used within useSelect and things like that)
 * which ensures the UI is always properly reactive. But, it's not the case with
 * the custom "sync" undo manager.
 *
 * Assumption: When an undo/redo is created, other parts of the core-data state
 * are likely changing simultaneously, which will trigger the selectors again.
 *
 * This issue is acceptable based on the assumption above.
 *
 * @see https://github.com/WordPress/gutenberg/pull/72407/files#r2580214235 for more details.
 *
 * @param state State tree.
 *
 * @return The undo manager.
 */
export declare function getUndoManager(state: State): import("@wordpress/sync").SyncUndoManager | import("@wordpress/undo-manager").UndoManager;
/**
 * Retrieve the fallback Navigation.
 *
 * @param state Data state.
 * @return The ID for the fallback Navigation post.
 */
export declare function getNavigationFallbackId(state: State): EntityRecordKey | undefined;
export declare const getBlockPatternsForPostType: {
    (state: any, postType: any): any;
    isRegistrySelector?: boolean;
    registry?: any;
};
/**
 * Returns the entity records permissions for the given entity record ids.
 */
export declare const getEntityRecordsPermissions: {
    (state: State, kind: string, name: string, ids: string | string[]): {
        delete: any;
        update: any;
    }[];
    isRegistrySelector?: boolean;
    registry?: any;
};
/**
 * Returns the entity record permissions for the given entity record id.
 *
 * @param state Data state.
 * @param kind  Entity kind.
 * @param name  Entity name.
 * @param id    Entity record id.
 *
 * @return The entity record permissions.
 */
export declare function getEntityRecordPermissions(state: State, kind: string, name: string, id: string): {
    delete: any;
    update: any;
};
/**
 * Returns the registered post meta fields for a given post type.
 *
 * @param state    Data state.
 * @param postType Post type.
 *
 * @return Registered post meta fields.
 */
export declare function getRegisteredPostMeta(state: State, postType: string): Object;
export declare const getHomePage: {
    (): {
        postType: string;
        postId: any;
    } | null;
    isRegistrySelector?: boolean;
    registry?: any;
};
export declare const getPostsPageId: {
    (): string | null;
    isRegistrySelector?: boolean;
    registry?: any;
};
export declare const getTemplateId: {
    (state: any, postType: any, postId: any): any;
    isRegistrySelector?: boolean;
    registry?: any;
};
/**
 * Returns the editor settings.
 *
 * @param state Data state.
 * @return Editor settings object or null if not loaded.
 */
export declare function getEditorSettings(state: State): Record<string, any> | null;
/**
 * Returns the editor assets.
 *
 * @param state Data state.
 * @return Editor assets object or null if not loaded.
 */
export declare function getEditorAssets(state: State): Record<string, any> | null;
/**
 * Returns whether collaboration is supported.
 *
 * @param state Data state.
 * @return Whether collaboration is supported.
 */
export declare function isCollaborationSupported(state: State): boolean;
export {};
//# sourceMappingURL=private-selectors.d.ts.map