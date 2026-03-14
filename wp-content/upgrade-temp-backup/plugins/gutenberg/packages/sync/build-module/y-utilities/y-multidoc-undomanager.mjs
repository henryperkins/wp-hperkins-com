// packages/sync/src/y-utilities/y-multidoc-undomanager.js
import * as array from "lib0/array";
import * as map from "lib0/map";
import { Observable } from "lib0/observable";
import * as Y from "yjs";
var popStackItem = (mum, type) => {
  const stack = type === "undo" ? mum.undoStack : mum.redoStack;
  while (stack.length > 0) {
    const um = (
      /** @type {Y.UndoManager} */
      stack.pop()
    );
    const prevUmStack = type === "undo" ? um.undoStack : um.redoStack;
    const stackItem = (
      /** @type {any} */
      prevUmStack.pop()
    );
    let actionPerformed = false;
    if (type === "undo") {
      um.undoStack = [stackItem];
      actionPerformed = um.undo() !== null;
      um.undoStack = prevUmStack;
    } else {
      um.redoStack = [stackItem];
      actionPerformed = um.redo() !== null;
      um.redoStack = prevUmStack;
    }
    if (actionPerformed) {
      return stackItem;
    }
  }
  return null;
};
var YMultiDocUndoManager = class extends Observable {
  /**
   * @param {Y.AbstractType<any>|Array<Y.AbstractType<any>>} typeScope Accepts either a single type, or an array of types
   * @param {ConstructorParameters<typeof Y.UndoManager>[1]} opts
   */
  constructor(typeScope = [], opts = {}) {
    super();
    this.docs = /* @__PURE__ */ new Map();
    this.trackedOrigins = opts.trackedOrigins || /* @__PURE__ */ new Set([null]);
    opts.trackedOrigins = this.trackedOrigins;
    this._defaultOpts = opts;
    this.undoStack = [];
    this.redoStack = [];
    this.addToScope(typeScope);
  }
  /**
   * @param {Array<Y.AbstractType<any>> | Y.AbstractType<any>} ytypes
   */
  addToScope(ytypes) {
    ytypes = array.isArray(ytypes) ? ytypes : [ytypes];
    ytypes.forEach((ytype) => {
      const ydoc = (
        /** @type {Y.Doc} */
        ytype.doc
      );
      const um = map.setIfUndefined(this.docs, ydoc, () => {
        const um2 = new Y.UndoManager([ytype], this._defaultOpts);
        um2.on(
          "stack-cleared",
          /** @param {any} opts */
          ({
            undoStackCleared,
            redoStackCleared
          }) => {
            this.clear(undoStackCleared, redoStackCleared);
          }
        );
        ydoc.on("destroy", () => {
          this.docs.delete(ydoc);
          this.undoStack = this.undoStack.filter(
            (um3) => um3.doc !== ydoc
          );
          this.redoStack = this.redoStack.filter(
            (um3) => um3.doc !== ydoc
          );
        });
        um2.on(
          "stack-item-added",
          /** @param {any} change */
          (change) => {
            const stack = change.type === "undo" ? this.undoStack : this.redoStack;
            stack.push(um2);
            this.emit("stack-item-added", [
              { ...change, ydoc },
              this
            ]);
          }
        );
        um2.on(
          "stack-item-updated",
          /** @param {any} change */
          (change) => {
            this.emit("stack-item-updated", [
              { ...change, ydoc },
              this
            ]);
          }
        );
        um2.on(
          "stack-item-popped",
          /** @param {any} change */
          (change) => {
            this.emit("stack-item-popped", [
              { ...change, ydoc },
              this
            ]);
          }
        );
        return um2;
      });
      if (um.scope.every((yt) => yt !== ytype)) {
        um.scope.push(ytype);
      }
    });
  }
  /**
   * @param {any} origin
   */
  /* c8 ignore next 3 */
  addTrackedOrigin(origin) {
    this.trackedOrigins.add(origin);
  }
  /**
   * @param {any} origin
   */
  /* c8 ignore next 3 */
  removeTrackedOrigin(origin) {
    this.trackedOrigins.delete(origin);
  }
  /**
   * Undo last changes on type.
   *
   * @return {any?} Returns StackItem if a change was applied
   */
  undo() {
    return popStackItem(this, "undo");
  }
  /**
   * Redo last undo operation.
   *
   * @return {any?} Returns StackItem if a change was applied
   */
  redo() {
    return popStackItem(this, "redo");
  }
  clear(clearUndoStack = true, clearRedoStack = true) {
    if (clearUndoStack && this.canUndo() || clearRedoStack && this.canRedo()) {
      this.docs.forEach((um) => {
        clearUndoStack && (this.undoStack = []);
        clearRedoStack && (this.redoStack = []);
        um.clear(clearUndoStack, clearRedoStack);
      });
      this.emit("stack-cleared", [
        {
          undoStackCleared: clearUndoStack,
          redoStackCleared: clearRedoStack
        }
      ]);
    }
  }
  /* c8 ignore next 5 */
  stopCapturing() {
    this.docs.forEach((um) => {
      um.stopCapturing();
    });
  }
  /**
   * Are undo steps available?
   *
   * @return {boolean} `true` if undo is possible
   */
  canUndo() {
    return this.undoStack.length > 0;
  }
  /**
   * Are redo steps available?
   *
   * @return {boolean} `true` if redo is possible
   */
  canRedo() {
    return this.redoStack.length > 0;
  }
  destroy() {
    this.docs.forEach((um) => um.destroy());
    super.destroy();
  }
};
var MultiDocUndoManager = YMultiDocUndoManager;
export {
  MultiDocUndoManager,
  YMultiDocUndoManager
};
//# sourceMappingURL=y-multidoc-undomanager.mjs.map
