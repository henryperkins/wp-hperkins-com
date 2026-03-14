// packages/preferences-persistence/src/migrations/legacy-local-storage-data/move-third-party-feature-preferences.js
function moveThirdPartyFeaturePreferencesToPreferences(state) {
  const interfaceStoreName = "core/interface";
  const preferencesStoreName = "core/preferences";
  const interfaceScopes = state?.[interfaceStoreName]?.preferences?.features;
  const interfaceScopeKeys = interfaceScopes ? Object.keys(interfaceScopes) : [];
  if (!interfaceScopeKeys?.length) {
    return state;
  }
  return interfaceScopeKeys.reduce(function(convertedState, scope) {
    if (scope.startsWith("core")) {
      return convertedState;
    }
    const featuresToMigrate = interfaceScopes?.[scope];
    if (!featuresToMigrate) {
      return convertedState;
    }
    const existingMigratedData = convertedState?.[preferencesStoreName]?.preferences?.[scope];
    if (existingMigratedData) {
      return convertedState;
    }
    const otherPreferencesScopes = convertedState?.[preferencesStoreName]?.preferences;
    const otherInterfaceState = convertedState?.[interfaceStoreName];
    const otherInterfaceScopes = convertedState?.[interfaceStoreName]?.preferences?.features;
    return {
      ...convertedState,
      [preferencesStoreName]: {
        preferences: {
          ...otherPreferencesScopes,
          [scope]: featuresToMigrate
        }
      },
      [interfaceStoreName]: {
        ...otherInterfaceState,
        preferences: {
          features: {
            ...otherInterfaceScopes,
            [scope]: void 0
          }
        }
      }
    };
  }, state);
}
export {
  moveThirdPartyFeaturePreferencesToPreferences as default
};
//# sourceMappingURL=move-third-party-feature-preferences.mjs.map
