// packages/preferences-persistence/src/migrations/legacy-local-storage-data/move-feature-preferences.js
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
export {
  moveFeaturePreferences as default
};
//# sourceMappingURL=move-feature-preferences.mjs.map
