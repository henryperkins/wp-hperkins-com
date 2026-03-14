// packages/global-styles-ui/src/font-library/api.ts
import apiFetch from "@wordpress/api-fetch";
import { store as coreDataStore } from "@wordpress/core-data";
var FONT_FAMILIES_URL = "/wp/v2/font-families";
function invalidateFontFamilyCache(registry) {
  const { receiveEntityRecords } = registry.dispatch(coreDataStore);
  receiveEntityRecords(
    "postType",
    "wp_font_family",
    [],
    void 0,
    true
    // invalidateCache
  );
}
async function fetchInstallFontFamily(data, registry) {
  const config = {
    path: FONT_FAMILIES_URL,
    method: "POST",
    body: data
  };
  const response = await apiFetch(config);
  invalidateFontFamilyCache(registry);
  return {
    id: response.id,
    ...response.font_family_settings,
    fontFace: []
  };
}
async function fetchInstallFontFace(fontFamilyId, data, registry) {
  const config = {
    path: `${FONT_FAMILIES_URL}/${fontFamilyId}/font-faces`,
    method: "POST",
    body: data
  };
  const response = await apiFetch(config);
  invalidateFontFamilyCache(registry);
  return {
    id: response.id,
    ...response.font_face_settings
  };
}
export {
  fetchInstallFontFace,
  fetchInstallFontFamily
};
//# sourceMappingURL=api.mjs.map
