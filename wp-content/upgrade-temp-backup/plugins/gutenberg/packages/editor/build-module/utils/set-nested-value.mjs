// packages/editor/src/utils/set-nested-value.js
function setNestedValue(object, path, value) {
  if (!object || typeof object !== "object") {
    return object;
  }
  path.reduce((acc, key, idx) => {
    if (acc[key] === void 0) {
      if (Number.isInteger(path[idx + 1])) {
        acc[key] = [];
      } else {
        acc[key] = {};
      }
    }
    if (idx === path.length - 1) {
      acc[key] = value;
    }
    return acc[key];
  }, object);
  return object;
}
export {
  setNestedValue as default
};
//# sourceMappingURL=set-nested-value.mjs.map
