var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/preferences-persistence/src/migrations/legacy-local-storage-data/move-individual-preference.js
var move_individual_preference_exports = {};
__export(move_individual_preference_exports, {
  default: () => moveIndividualPreferenceToPreferences
});
module.exports = __toCommonJS(move_individual_preference_exports);
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
//# sourceMappingURL=move-individual-preference.cjs.map
