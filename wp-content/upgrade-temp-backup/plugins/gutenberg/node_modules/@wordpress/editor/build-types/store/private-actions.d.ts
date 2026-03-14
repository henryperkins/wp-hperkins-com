/**
 * Returns an action object used to set which template is currently being used/edited.
 *
 * @param {string} id Template Id.
 *
 * @return {Object} Action object.
 */
export function setCurrentTemplateId(id: string): Object;
/**
 * Set the current global styles navigation path.
 *
 * @param {string} path The navigation path.
 * @return {Object} Action object.
 */
export function setStylesPath(path: string): Object;
/**
 * Set whether the stylebook is visible.
 *
 * @param {boolean} show Whether to show the stylebook.
 * @return {Object} Action object.
 */
export function setShowStylebook(show: boolean): Object;
/**
 * Reset the global styles navigation to initial state.
 *
 * @return {Object} Action object.
 */
export function resetStylesNavigation(): Object;
/**
 * Set the minimum height of the canvas.
 *
 * @param {number} minHeight
 * @return {Object} Action object.
 */
export function setCanvasMinHeight(minHeight: number): Object;
/**
 * Set the current revision ID for revisions preview mode.
 * Pass a revision ID to enter revisions mode, or null to exit.
 *
 * @param {number|null} revisionId The revision ID, or null to exit revisions mode.
 * @return {Object} Action object.
 */
export function setCurrentRevisionId(revisionId: number | null): Object;
/**
 * Select a note by its ID, or clear the selection.
 *
 * @param {undefined|number|'new'} noteId          The note ID to select, 'new' to open the new note form, or undefined to clear.
 * @param {Object}                 [options]       Optional options for the selection.
 * @param {boolean}                [options.focus] Whether to focus the selected note. Default false.
 * @return {Object} Action object.
 */
export function selectNote(noteId: undefined | number | "new", options?: {
    focus?: boolean | undefined;
}): Object;
export * from "../dataviews/store/private-actions";
export function createTemplate(template: Object | null): ({ select, dispatch, registry }: {
    select: any;
    dispatch: any;
    registry: any;
}) => Promise<any>;
export function showBlockTypes(blockNames: string[]): ({ registry }: {
    registry: any;
}) => void;
export function hideBlockTypes(blockNames: string[]): ({ registry }: {
    registry: any;
}) => void;
export function saveDirtyEntities({ onSave, dirtyEntityRecords, entitiesToSkip, close, successNoticeContent, }?: {
    onSave?: Function | undefined;
    dirtyEntityRecords?: object[] | undefined;
    entitiesToSkip?: object[] | undefined;
    close?: Function | undefined;
    successNoticeContent?: string | undefined;
}): ({ registry }: {
    registry: any;
}) => void;
export function revertTemplate(template: Object, { allowUndo }?: {
    allowUndo?: boolean | undefined;
}): ({ registry }: {
    registry: any;
}) => Promise<void>;
export function removeTemplates(items: any[]): ({ registry }: {
    registry: any;
}) => Promise<void>;
export function setDefaultRenderingMode(mode: string): ({ select, registry }: {
    select: any;
    registry: any;
}) => void;
export function restoreRevision(revisionId: number): ({ select, dispatch, registry }: {
    select: any;
    dispatch: any;
    registry: any;
}) => Promise<void>;
//# sourceMappingURL=private-actions.d.ts.map