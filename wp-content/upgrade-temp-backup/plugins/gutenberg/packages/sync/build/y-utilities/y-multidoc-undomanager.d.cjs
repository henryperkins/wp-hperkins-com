"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/sync/src/y-utilities/y-multidoc-undomanager.d.ts
var y_multidoc_undomanager_d_exports = {};
__export(y_multidoc_undomanager_d_exports, {
  MultiDocUndoManager: () => YMultiDocUndoManager,
  YMultiDocUndoManager: () => YMultiDocUndoManager
});
module.exports = __toCommonJS(y_multidoc_undomanager_d_exports);
var YMultiDocUndoManager = class extends Observable {
  docs;
  trackedOrigins;
  undoStack;
  redoStack;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MultiDocUndoManager,
  YMultiDocUndoManager
});
//# sourceMappingURL=y-multidoc-undomanager.d.cjs.map
