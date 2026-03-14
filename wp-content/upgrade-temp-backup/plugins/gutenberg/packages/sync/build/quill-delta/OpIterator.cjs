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

// packages/sync/src/quill-delta/OpIterator.ts
var OpIterator_exports = {};
__export(OpIterator_exports, {
  default: () => Iterator
});
module.exports = __toCommonJS(OpIterator_exports);
var import_Op = __toESM(require("./Op.cjs"));
var Iterator = class {
  ops;
  index;
  offset;
  constructor(ops) {
    this.ops = ops;
    this.index = 0;
    this.offset = 0;
  }
  hasNext() {
    return this.peekLength() < Infinity;
  }
  next(length) {
    if (!length) {
      length = Infinity;
    }
    const nextOp = this.ops[this.index];
    if (nextOp) {
      const offset = this.offset;
      const opLength = import_Op.default.length(nextOp);
      if (length >= opLength - offset) {
        length = opLength - offset;
        this.index += 1;
        this.offset = 0;
      } else {
        this.offset += length;
      }
      if (typeof nextOp.delete === "number") {
        return { delete: length };
      }
      const retOp = {};
      if (nextOp.attributes) {
        retOp.attributes = nextOp.attributes;
      }
      if (typeof nextOp.retain === "number") {
        retOp.retain = length;
      } else if (typeof nextOp.retain === "object" && nextOp.retain !== null) {
        retOp.retain = nextOp.retain;
      } else if (typeof nextOp.insert === "string") {
        retOp.insert = nextOp.insert.substr(offset, length);
      } else {
        retOp.insert = nextOp.insert;
      }
      return retOp;
    }
    return { retain: Infinity };
  }
  peek() {
    return this.ops[this.index];
  }
  peekLength() {
    if (this.ops[this.index]) {
      return import_Op.default.length(this.ops[this.index]) - this.offset;
    }
    return Infinity;
  }
  peekType() {
    const op = this.ops[this.index];
    if (op) {
      if (typeof op.delete === "number") {
        return "delete";
      } else if (typeof op.retain === "number" || typeof op.retain === "object" && op.retain !== null) {
        return "retain";
      }
      return "insert";
    }
    return "retain";
  }
  rest() {
    if (!this.hasNext()) {
      return [];
    } else if (this.offset === 0) {
      return this.ops.slice(this.index);
    }
    const offset = this.offset;
    const index = this.index;
    const next = this.next();
    const rest = this.ops.slice(this.index);
    this.offset = offset;
    this.index = index;
    return [next].concat(rest);
  }
};
//# sourceMappingURL=OpIterator.cjs.map
