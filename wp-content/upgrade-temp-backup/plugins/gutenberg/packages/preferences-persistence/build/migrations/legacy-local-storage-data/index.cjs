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

// packages/preferences-persistence/src/migrations/legacy-local-storage-data/index.js
var legacy_local_storage_data_exports = {};
__export(legacy_local_storage_data_exports, {
  convertLegacyData: () => convertLegacyData,
  default: () => convertLegacyLocalStorageData
});
module.exports = __toCommonJS(legacy_local_storage_data_exports);
var import_move_feature_preferences = __toESM(require("./move-feature-preferences.cjs"));
var import_move_third_party_feature_preferences = __toESM(require("./move-third-party-feature-preferences.cjs"));
var import_move_individual_preference = __toESM(require("./move-individual-preference.cjs"));
var import_move_interface_enable_items = __toESM(require("./move-interface-enable-items.cjs"));
var import_convert_edit_post_panels = __toESM(require("./convert-edit-post-panels.cjs"));
function getLegacyData(userId) {
  const key = `WP_DATA_USER_${userId}`;
  const unparsedData = window.localStorage.getItem(key);
  return JSON.parse(unparsedData);
}
function convertLegacyData(data) {
  if (!data) {
    return;
  }
  data = (0, import_move_feature_preferences.default)(data, "core/edit-widgets");
  data = (0, import_move_feature_preferences.default)(data, "core/customize-widgets");
  data = (0, import_move_feature_preferences.default)(data, "core/edit-post");
  data = (0, import_move_feature_preferences.default)(data, "core/edit-site");
  data = (0, import_move_third_party_feature_preferences.default)(data);
  data = (0, import_move_interface_enable_items.default)(data);
  data = (0, import_move_individual_preference.default)(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "hiddenBlockTypes"
  );
  data = (0, import_move_individual_preference.default)(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "editorMode"
  );
  data = (0, import_move_individual_preference.default)(
    data,
    { from: "core/edit-post", to: "core/edit-post" },
    "panels",
    import_convert_edit_post_panels.default
  );
  data = (0, import_move_individual_preference.default)(
    data,
    { from: "core/editor", to: "core" },
    "isPublishSidebarEnabled"
  );
  data = (0, import_move_individual_preference.default)(
    data,
    { from: "core/edit-post", to: "core" },
    "isPublishSidebarEnabled"
  );
  data = (0, import_move_individual_preference.default)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  convertLegacyData
});
//# sourceMappingURL=index.cjs.map
