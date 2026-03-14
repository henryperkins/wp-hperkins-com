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

// packages/preferences-persistence/src/migrations/legacy-local-storage-data/move-feature-preferences.js
var move_feature_preferences_exports = {};
__export(move_feature_preferences_exports, {
  default: () => moveFeaturePreferences
});
module.exports = __toCommonJS(move_feature_preferences_exports);
function moveFeaturePreferences(state, sourceStoreName) {
  const preferencesStoreName = "core/preferences";
  const interfaceStoreName = "core/interface";
  const interfaceFeatures = state?.[interfaceStoreName]?.preferences?.features?.[sourceStoreName];
  const sourceFeatures = state?.[sourceStoreName]?.preferences?.features;
  const featuresToMigrate = interfaceFeatures ? interfaceFeatures : sourceFeatures;
  if (!featuresToMigrate) {
    return state;
  }
  const existingPreferences = state?.[preferencesStoreName]?.preferences;
  if (existingPreferences?.[sourceStoreName]) {
    return state;
  }
  let updatedInterfaceState;
  if (interfaceFeatures) {
    const otherInterfaceState = state?.[interfaceStoreName];
    const otherInterfaceScopes = state?.[interfaceStoreName]?.preferences?.features;
    updatedInterfaceState = {
      [interfaceStoreName]: {
        ...otherInterfaceState,
        preferences: {
          features: {
            ...otherInterfaceScopes,
            [sourceStoreName]: void 0
          }
        }
      }
    };
  }
  let updatedSourceState;
  if (sourceFeatures) {
    const otherSourceState = state?.[sourceStoreName];
    const sourcePreferences = state?.[sourceStoreName]?.preferences;
    updatedSourceState = {
      [sourceStoreName]: {
        ...otherSourceState,
        preferences: {
          ...sourcePreferences,
          features: void 0
        }
      }
    };
  }
  return {
    ...state,
    [preferencesStoreName]: {
      preferences: {
        ...existingPreferences,
        [sourceStoreName]: featuresToMigrate
      }
    },
    ...updatedInterfaceState,
    ...updatedSourceState
  };
}
//# sourceMappingURL=move-feature-preferences.cjs.map
