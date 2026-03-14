// packages/preferences-persistence/src/migrations/legacy-local-storage-data/index.js
import moveFeaturePreferences from "./move-feature-preferences.mjs";
import moveThirdPartyFeaturePreferences from "./move-third-party-feature-preferences.mjs";
import moveIndividualPreference from "./move-individual-preference.mjs";
import moveInterfaceEnableItems from "./move-interface-enable-items.mjs";
import convertEditPostPanels from "./convert-edit-post-panels.mjs";
function getLegacyData(userId) {
  const key = `WP_DATA_USER_${userId}`;
  const unparsedData = window.localStorage.getItem(key);
  return JSON.parse(unparsedData);
}
function convertLegacyData(data) {
  if (!data) {
    return;
  }
  data = moveFeaturePreferences(data, "core/edit-widgets");
  data = moveFeaturePreferences(data, "core/customize-widgets");
  data = moveFeaturePreferences(data, "core/edit-post");
  data = moveFeaturePreferences(data, "core/edit-site");
  data = moveThirdPartyFeaturePreferences(data);
  data = moveInterfaceEnableItems(data);
  data = moveIndividualPreference(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "hiddenBlockTypes"
  );
  data = moveIndividualPreference(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "editorMode"
  );
  data = moveIndividualPreference(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "panels",
    convertEditPostPanels
  );
  data = moveIndividualPreference(
    data,
    { from: "core/editor", to: "core" },
    "isPublishSidebarEnabled"
  );
  data = moveIndividualPreference(
    data,
    { from: "core/edit-post", to: "core" },
    "isPublishSidebarEnabled"
  );
  data = moveIndividualPreference(
    data,
    { from: "core/edit-site", to: "core/edit-site" },
    "editorMode"
  );
  return data?.["core/preferences"]?.preferences;
}
function convertLegacyLocalStorageData(userId) {
  const data = getLegacyData(userId);
  return convertLegacyData(data);
}
export {
  convertLegacyData,
  convertLegacyLocalStorageData as default
};
//# sourceMappingURL=index.mjs.map
