// packages/preferences-persistence/src/migrations/legacy-local-storage-data/move-individual-preference.js
var identity = (arg) => arg;
function moveIndividualPreferenceToPreferences(state, { from: sourceStoreName, to: scope }, key, convert = identity) {
  const preferencesStoreName = "core/preferences";
  const sourcePreference = state?.[sourceStoreName]?.preferences?.[key];
  if (sourcePreference === void 0) {
    return state;
  }
  const targetPreference = state?.[preferencesStoreName]?.preferences?.[scope]?.[key];
  if (targetPreference) {
    return state;
  }
  const otherScopes = state?.[preferencesStoreName]?.preferences;
  const otherPreferences = state?.[preferencesStoreName]?.preferences?.[scope];
  const otherSourceState = state?.[sourceStoreName];
  const allSourcePreferences = state?.[sourceStoreName]?.preferences;
  const convertedPreferences = convert({ [key]: sourcePreference });
  return {
    ...state,
    [preferencesStoreName]: {
      preferences: {
        ...otherScopes,
        [scope]: {
          ...otherPreferences,
          ...convertedPreferences
        }
      }
    },
    [sourceStoreName]: {
      ...otherSourceState,
      preferences: {
        ...allSourcePreferences,
        [key]: void 0
      }
    }
  };
}
export {
  moveIndividualPreferenceToPreferences as default
};
//# sourceMappingURL=move-individual-preference.mjs.map
