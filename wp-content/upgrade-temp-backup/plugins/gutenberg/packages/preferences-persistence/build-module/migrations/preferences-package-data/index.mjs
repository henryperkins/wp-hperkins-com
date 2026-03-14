// packages/preferences-persistence/src/migrations/preferences-package-data/index.js
import convertComplementaryAreas from "./convert-complementary-areas.mjs";
import convertEditorSettings from "./convert-editor-settings.mjs";
function convertPreferencesPackageData(data) {
  let newData = convertComplementaryAreas(data);
  newData = convertEditorSettings(newData);
  return newData;
}
export {
  convertPreferencesPackageData as default
};
//# sourceMappingURL=index.mjs.map
