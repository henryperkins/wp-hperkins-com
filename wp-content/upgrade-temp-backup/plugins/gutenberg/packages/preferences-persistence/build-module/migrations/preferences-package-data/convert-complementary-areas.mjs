// packages/preferences-persistence/src/migrations/preferences-package-data/convert-complementary-areas.js
function convertComplementaryAreas(state) {
  return Object.keys(state).reduce((stateAccumulator, scope) => {
    const scopeData = state[scope];
    if (scopeData?.complementaryArea) {
      const updatedScopeData = { ...scopeData };
      delete updatedScopeData.complementaryArea;
      updatedScopeData.isComplementaryAreaVisible = true;
      stateAccumulator[scope] = updatedScopeData;
      return stateAccumulator;
    }
    return stateAccumulator;
  }, state);
}
export {
  convertComplementaryAreas as default
};
//# sourceMappingURL=convert-complementary-areas.mjs.map
