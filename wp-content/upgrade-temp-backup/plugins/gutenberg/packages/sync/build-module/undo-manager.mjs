// packages/sync/src/undo-manager.ts
import { LOCAL_EDITOR_ORIGIN } from "./config.mjs";
import { YMultiDocUndoManager } from "./y-utilities/y-multidoc-undomanager.mjs";
function createUndoManager() {
  const yUndoManager = new YMultiDocUndoManager([], {
    // Throttle undo/redo captures after 500ms of inactivity.
    // 500 was selected from subjective local UX testing, shorter timeouts
    // may cause mid-word undo stack items.
    captureTimeout: 500,
    // Ensure that we only scope the undo/redo to the current editor.
    // The yjs document's clientID is added once it's available.
    trackedOrigins: /* @__PURE__ */ new Set([LOCAL_EDITOR_ORIGIN])
  });
  return {
    /**
     * Record changes into the history.
     * Since Yjs automatically tracks changes, this method translates the WordPress
     * HistoryRecord format into Yjs operations.
     *
     * @param _record   A record of changes to record.
     * @param _isStaged Whether to immediately create an undo point or not.
     */
    addRecord(_record, _isStaged = false) {
    },
    /**
     * Add a Yjs map to the scope of the undo manager.
     *
     * @param {Y.Map< any >} ymap                     The Yjs map to add to the scope.
     * @param                handlers
     * @param                handlers.addUndoMeta
     * @param                handlers.restoreUndoMeta
     */
    addToScope(ymap, handlers) {
      if (ymap.doc === null) {
        return;
      }
      const ydoc = ymap.doc;
      yUndoManager.addToScope(ymap);
      const { addUndoMeta, restoreUndoMeta } = handlers;
      yUndoManager.on("stack-item-added", (event) => {
        addUndoMeta(ydoc, event.stackItem.meta);
      });
      yUndoManager.on("stack-item-popped", (event) => {
        restoreUndoMeta(ydoc, event.stackItem.meta);
      });
    },
    /**
     * Undo the last recorded changes.
     *
     */
    undo() {
      if (!yUndoManager.canUndo()) {
        return;
      }
      yUndoManager.undo();
      return [];
    },
    /**
     * Redo the last undone changes.
     */
    redo() {
      if (!yUndoManager.canRedo()) {
        return;
      }
      yUndoManager.redo();
      return [];
    },
    /**
     * Check if there are changes that can be undone.
     *
     * @return {boolean} Whether there are changes to undo.
     */
    hasUndo() {
      return yUndoManager.canUndo();
    },
    /**
     * Check if there are changes that can be redone.
     *
     * @return {boolean} Whether there are changes to redo.
     */
    hasRedo() {
      return yUndoManager.canRedo();
    },
    /**
     * Stop capturing changes into the current undo item.
     * The next change will create a new undo item.
     */
    stopCapturing() {
      yUndoManager.stopCapturing();
    }
  };
}
export {
  createUndoManager
};
//# sourceMappingURL=undo-manager.mjs.map
