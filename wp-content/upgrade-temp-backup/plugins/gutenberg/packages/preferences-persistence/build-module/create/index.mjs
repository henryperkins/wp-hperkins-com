// packages/preferences-persistence/src/create/index.js
import apiFetch from "@wordpress/api-fetch";
import debounceAsync from "./debounce-async.mjs";
var EMPTY_OBJECT = {};
var localStorage = window.localStorage;
function create({
  preloadedData,
  localStorageRestoreKey = "WP_PREFERENCES_RESTORE_DATA",
  requestDebounceMS = 2500
} = {}) {
  let cache = preloadedData;
  const debouncedApiFetch = debounceAsync(apiFetch, requestDebounceMS);
  async function get() {
    if (cache) {
      return cache;
    }
    const user = await apiFetch({
      path: "/wp/v2/users/me?context=edit"
    });
    const serverData = user?.meta?.persisted_preferences;
    const localData = JSON.parse(
      localStorage.getItem(localStorageRestoreKey)
    );
    const serverTimestamp = Date.parse(serverData?._modified) || 0;
    const localTimestamp = Date.parse(localData?._modified) || 0;
    if (serverData && serverTimestamp >= localTimestamp) {
      cache = serverData;
    } else if (localData) {
      cache = localData;
    } else {
      cache = EMPTY_OBJECT;
    }
    return cache;
  }
  function set(newData) {
    const dataWithTimestamp = {
      ...newData,
      _modified: (/* @__PURE__ */ new Date()).toISOString()
    };
    cache = dataWithTimestamp;
    localStorage.setItem(
      localStorageRestoreKey,
      JSON.stringify(dataWithTimestamp)
    );
    debouncedApiFetch({
      path: "/wp/v2/users/me",
      method: "PUT",
      // `keepalive` will still send the request in the background,
      // even when a browser unload event might interrupt it.
      // This should hopefully make things more resilient.
      // This does have a size limit of 64kb, but the data is usually
      // much less.
      keepalive: true,
      data: {
        meta: {
          persisted_preferences: dataWithTimestamp
        }
      }
    }).catch(() => {
    });
  }
  return {
    get,
    set
  };
}
export {
  create as default
};
//# sourceMappingURL=index.mjs.map
