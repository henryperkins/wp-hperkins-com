// packages/global-styles-ui/src/font-library/utils/set-immutably.ts
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
export {
  setImmutably
};
//# sourceMappingURL=set-immutably.mjs.map
