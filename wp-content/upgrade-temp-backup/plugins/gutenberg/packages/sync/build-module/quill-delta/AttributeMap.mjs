// packages/sync/src/quill-delta/AttributeMap.ts
import { default as isEqual } from "fast-deep-equal/es6";
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
      if (!isEqual(a[key], b[key])) {
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
export {
  AttributeMap_default as default
};
//# sourceMappingURL=AttributeMap.mjs.map
