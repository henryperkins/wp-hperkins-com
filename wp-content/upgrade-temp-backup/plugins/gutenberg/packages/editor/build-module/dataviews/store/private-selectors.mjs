// packages/editor/src/dataviews/store/private-selectors.ts
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
export {
  getEntityActions,
  getEntityFields,
  isEntityReady
};
//# sourceMappingURL=private-selectors.mjs.map
