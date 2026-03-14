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

// packages/preferences-persistence/src/migrations/legacy-local-storage-data/move-interface-enable-items.js
var move_interface_enable_items_exports = {};
__export(move_interface_enable_items_exports, {
  default: () => moveInterfaceEnableItems
});
module.exports = __toCommonJS(move_interface_enable_items_exports);
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
//# sourceMappingURL=move-interface-enable-items.cjs.map
