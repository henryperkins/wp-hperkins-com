// packages/sync/src/quill-delta/Op.ts
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
export {
  Op_default as default
};
//# sourceMappingURL=Op.mjs.map
