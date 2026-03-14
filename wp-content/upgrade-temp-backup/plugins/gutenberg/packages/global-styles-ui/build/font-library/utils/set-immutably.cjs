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

// packages/global-styles-ui/src/font-library/utils/set-immutably.ts
var set_immutably_exports = {};
__export(set_immutably_exports, {
  setImmutably: () => setImmutably
});
module.exports = __toCommonJS(set_immutably_exports);
function setImmutably(object, path, value) {
  path = Array.isArray(path) ? [...path] : [path];
  object = Array.isArray(object) ? [...object] : { ...object };
  const leaf = path.pop();
  let prev = object;
  for (const key of path) {
    const lvl = prev[key];
    prev = prev[key] = Array.isArray(lvl) ? [...lvl] : { ...lvl };
  }
  prev[leaf] = value;
  return object;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  setImmutably
});
//# sourceMappingURL=set-immutably.cjs.map
