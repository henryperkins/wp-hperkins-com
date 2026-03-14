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

// packages/customize-widgets/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  __experimentalGetInsertionPoint: () => __experimentalGetInsertionPoint,
  isInserterOpened: () => isInserterOpened
});
module.exports = __toCommonJS(selectors_exports);
var EMPTY_INSERTION_POINT = {
  rootClientId: void 0,
  insertionIndex: void 0
};
function isInserterOpened(state) {
  return !!state.blockInserterPanel;
}
function __experimentalGetInsertionPoint(state) {
  if (typeof state.blockInserterPanel === "boolean") {
    return EMPTY_INSERTION_POINT;
  }
  return state.blockInserterPanel;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalGetInsertionPoint,
  isInserterOpened
});
//# sourceMappingURL=selectors.cjs.map
