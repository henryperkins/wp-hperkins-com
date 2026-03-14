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

// packages/sync/src/quill-delta/Op.ts
var Op_exports = {};
__export(Op_exports, {
  default: () => Op_default
});
module.exports = __toCommonJS(Op_exports);
var Op;
((Op2) => {
  function length(op) {
    if (typeof op.delete === "number") {
      return op.delete;
    } else if (typeof op.retain === "number") {
      return op.retain;
    } else if (typeof op.retain === "object" && op.retain !== null) {
      return 1;
    }
    return typeof op.insert === "string" ? op.insert.length : 1;
  }
  Op2.length = length;
})(Op || (Op = {}));
var Op_default = Op;
//# sourceMappingURL=Op.cjs.map
