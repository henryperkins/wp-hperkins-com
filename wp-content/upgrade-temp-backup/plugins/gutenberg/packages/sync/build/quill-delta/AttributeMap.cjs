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

// packages/sync/src/quill-delta/AttributeMap.ts
var AttributeMap_exports = {};
__export(AttributeMap_exports, {
  default: () => AttributeMap_default
});
module.exports = __toCommonJS(AttributeMap_exports);
var import_es6 = __toESM(require("fast-deep-equal/es6"));
function cloneDeep(value) {
  return JSON.parse(JSON.stringify(value));
}
var AttributeMap;
((AttributeMap2) => {
  function compose(a = {}, b = {}, keepNull = false) {
    if (typeof a !== "object") {
      a = {};
    }
    if (typeof b !== "object") {
      b = {};
    }
    let attributes = cloneDeep(b);
    if (!keepNull) {
      attributes = Object.keys(attributes).reduce(
        (copy, key) => {
          if (attributes[key] !== null || attributes[key] !== void 0) {
            copy[key] = attributes[key];
          }
          return copy;
        },
        {}
      );
    }
    for (const key in a) {
      if (a[key] !== void 0 && b[key] === void 0) {
        attributes[key] = a[key];
      }
    }
    return Object.keys(attributes).length > 0 ? attributes : void 0;
  }
  AttributeMap2.compose = compose;
  function diff(a = {}, b = {}) {
    if (typeof a !== "object") {
      a = {};
    }
    if (typeof b !== "object") {
      b = {};
    }
    const attributes = Object.keys(a).concat(Object.keys(b)).reduce((attrs, key) => {
      if (!(0, import_es6.default)(a[key], b[key])) {
        attrs[key] = b[key] === void 0 ? null : b[key];
      }
      return attrs;
    }, {});
    return Object.keys(attributes).length > 0 ? attributes : void 0;
  }
  AttributeMap2.diff = diff;
  function invert(attr = {}, base = {}) {
    attr = attr || {};
    const baseInverted = Object.keys(base).reduce(
      (memo, key) => {
        if (base[key] !== attr[key] && attr[key] !== void 0) {
          memo[key] = base[key];
        }
        return memo;
      },
      {}
    );
    return Object.keys(attr).reduce((memo, key) => {
      if (attr[key] !== base[key] && base[key] === void 0) {
        memo[key] = null;
      }
      return memo;
    }, baseInverted);
  }
  AttributeMap2.invert = invert;
  function transform(a, b, priority = false) {
    if (typeof a !== "object") {
      return b;
    }
    if (typeof b !== "object") {
      return void 0;
    }
    if (!priority) {
      return b;
    }
    const attributes = Object.keys(b).reduce(
      (attrs, key) => {
        if (a[key] === void 0) {
          attrs[key] = b[key];
        }
        return attrs;
      },
      {}
    );
    return Object.keys(attributes).length > 0 ? attributes : void 0;
  }
  AttributeMap2.transform = transform;
})(AttributeMap || (AttributeMap = {}));
var AttributeMap_default = AttributeMap;
//# sourceMappingURL=AttributeMap.cjs.map
