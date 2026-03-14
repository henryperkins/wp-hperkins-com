"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/sync/src/y-utilities/y-multidoc-undomanager.js
var y_multidoc_undomanager_exports = {};
__export(y_multidoc_undomanager_exports, {
  MultiDocUndoManager: () => MultiDocUndoManager,
  YMultiDocUndoManager: () => YMultiDocUndoManager
});
module.exports = __toCommonJS(y_multidoc_undomanager_exports);
var array = __toESM(require("lib0/array"));
var map = __toESM(require("lib0/map"));
var import_observable = require("lib0/observable");
var Y = __toESM(require("yjs"));
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
var YMultiDocUndoManager = class extends import_observable.Observable {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MultiDocUndoManager,
  YMultiDocUndoManager
});
//# sourceMappingURL=y-multidoc-undomanager.cjs.map
