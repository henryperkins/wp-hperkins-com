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

// packages/editor/src/dataviews/store/private-selectors.ts
var private_selectors_exports = {};
__export(private_selectors_exports, {
  getEntityActions: () => getEntityActions,
  getEntityFields: () => getEntityFields,
  isEntityReady: () => isEntityReady
});
module.exports = __toCommonJS(private_selectors_exports);
var EMPTY_ARRAY = [];
function getEntityActions(state, kind, name) {
  return state.actions[kind]?.[name] ?? EMPTY_ARRAY;
}
function getEntityFields(state, kind, name) {
  return state.fields[kind]?.[name] ?? EMPTY_ARRAY;
}
function isEntityReady(state, kind, name) {
  return state.isReady[kind]?.[name];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getEntityActions,
  getEntityFields,
  isEntityReady
});
//# sourceMappingURL=private-selectors.cjs.map
