// packages/preferences-persistence/src/index.js
import create from "./create/index.mjs";
import convertLegacyLocalStorageData from "./migrations/legacy-local-storage-data/index.mjs";
import convertPreferencesPackageData from "./migrations/preferences-package-data/index.mjs";
function __unstableCreatePersistenceLayer(serverData, userId) {
  const localStorageRestoreKey = `WP_PREFERENCES_USER_${userId}`;
  const localData = JSON.parse(
    window.localStorage.getItem(localStorageRestoreKey)
  );
  const serverModified = Date.parse(serverData && serverData._modified) || 0;
  const localModified = Date.parse(localData && localData._modified) || 0;
  let preloadedData;
  if (serverData && serverModified >= localModified) {
    preloadedData = convertPreferencesPackageData(serverData);
  } else if (localData) {
    preloadedData = convertPreferencesPackageData(localData);
  } else {
    preloadedData = convertLegacyLocalStorageData(userId);
  }
  return create({
    preloadedData,
    localStorageRestoreKey
  });
}
export {
  __unstableCreatePersistenceLayer,
  create
};
//# sourceMappingURL=index.mjs.map
