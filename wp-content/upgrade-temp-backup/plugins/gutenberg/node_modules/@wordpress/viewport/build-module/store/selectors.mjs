// packages/viewport/src/store/selectors.js
function isViewportMatch(state, query) {
  if (query.indexOf(" ") === -1) {
    query = ">= " + query;
  }
  return !!state[query];
}
export {
  isViewportMatch
};
//# sourceMappingURL=selectors.mjs.map
