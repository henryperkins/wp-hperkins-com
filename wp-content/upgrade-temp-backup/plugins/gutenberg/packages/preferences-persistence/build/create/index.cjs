var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/preferences-persistence/src/create/index.js
var create_exports = {};
__export(create_exports, {
  default: () => create
});
module.exports = __toCommonJS(create_exports);
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_debounce_async = __toESM(require("./debounce-async.cjs"));
var EMPTY_OBJECT = {};
var localStorage = window.localStorage;
function create({
  preloadedData,
  localStorageRestoreKey = "WP_PREFERENCES_RESTORE_DATA",
  requestDebounceMS = 2500
} = {}) {
  let cache = preloadedData;
  const debouncedApiFetch = (0, import_debounce_async.default)(import_api_fetch.default, requestDebounceMS);
  async function get() {
    if (cache) {
      return cache;
    }
    const user = await (0, import_api_fetch.default)({
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
//# sourceMappingURL=index.cjs.map
