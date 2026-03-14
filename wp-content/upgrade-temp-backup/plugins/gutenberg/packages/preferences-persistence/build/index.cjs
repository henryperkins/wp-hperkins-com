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

// packages/preferences-persistence/src/index.js
var index_exports = {};
__export(index_exports, {
  __unstableCreatePersistenceLayer: () => __unstableCreatePersistenceLayer,
  create: () => import_create.default
});
module.exports = __toCommonJS(index_exports);
var import_create = __toESM(require("./create/index.cjs"));
var import_legacy_local_storage_data = __toESM(require("./migrations/legacy-local-storage-data/index.cjs"));
var import_preferences_package_data = __toESM(require("./migrations/preferences-package-data/index.cjs"));
function __unstableCreatePersistenceLayer(serverData, userId) {
  const localStorageRestoreKey = `WP_PREFERENCES_USER_${userId}`;
  const localData = JSON.parse(
    window.localStorage.getItem(localStorageRestoreKey)
  );
  const serverModified = Date.parse(serverData && serverData._modified) || 0;
  const localModified = Date.parse(localData && localData._modified) || 0;
  let preloadedData;
  if (serverData && serverModified >= localModified) {
    preloadedData = (0, import_preferences_package_data.default)(serverData);
  } else if (localData) {
    preloadedData = (0, import_preferences_package_data.default)(localData);
  } else {
    preloadedData = (0, import_legacy_local_storage_data.default)(userId);
  }
  return (0, import_create.default)({
    preloadedData,
    localStorageRestoreKey
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __unstableCreatePersistenceLayer,
  create
});
//# sourceMappingURL=index.cjs.map
