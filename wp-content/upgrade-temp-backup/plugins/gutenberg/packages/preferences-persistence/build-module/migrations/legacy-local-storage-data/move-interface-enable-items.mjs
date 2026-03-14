// packages/preferences-persistence/src/migrations/legacy-local-storage-data/move-interface-enable-items.js
function moveInterfaceEnableItems(state) {
  const interfaceStoreName = "core/interface";
  const preferencesStoreName = "core/preferences";
  const sourceEnableItems = state?.[interfaceStoreName]?.enableItems;
  if (!sourceEnableItems) {
    return state;
  }
  const allPreferences = state?.[preferencesStoreName]?.preferences ?? {};
  const sourceComplementaryAreas = sourceEnableItems?.singleEnableItems?.complementaryArea ?? {};
  const preferencesWithConvertedComplementaryAreas = Object.keys(
    sourceComplementaryAreas
  ).reduce((accumulator, scope) => {
    const data = sourceComplementaryAreas[scope];
    if (accumulator?.[scope]?.complementaryArea) {
      return accumulator;
    }
    return {
      ...accumulator,
      [scope]: {
        ...accumulator[scope],
        complementaryArea: data
      }
    };
  }, allPreferences);
  const sourcePinnedItems = sourceEnableItems?.multipleEnableItems?.pinnedItems ?? {};
  const allConvertedData = Object.keys(sourcePinnedItems).reduce(
    (accumulator, scope) => {
      const data = sourcePinnedItems[scope];
      if (accumulator?.[scope]?.pinnedItems) {
        return accumulator;
      }
      return {
        ...accumulator,
        [scope]: {
          ...accumulator[scope],
          pinnedItems: data
        }
      };
    },
    preferencesWithConvertedComplementaryAreas
  );
  const otherInterfaceItems = state[interfaceStoreName];
  return {
    ...state,
    [preferencesStoreName]: {
      preferences: allConvertedData
    },
    [interfaceStoreName]: {
      ...otherInterfaceItems,
      enableItems: void 0
    }
  };
}
export {
  moveInterfaceEnableItems as default
};
//# sourceMappingURL=move-interface-enable-items.mjs.map
