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

// packages/preferences-persistence/src/migrations/preferences-package-data/index.js
var preferences_package_data_exports = {};
__export(preferences_package_data_exports, {
  default: () => convertPreferencesPackageData
});
module.exports = __toCommonJS(preferences_package_data_exports);
var import_convert_complementary_areas = __toESM(require("./convert-complementary-areas.cjs"));
var import_convert_editor_settings = __toESM(require("./convert-editor-settings.cjs"));
function convertPreferencesPackageData(data) {
  let newData = (0, import_convert_complementary_areas.default)(data);
  newData = (0, import_convert_editor_settings.default)(newData);
  return newData;
}
//# sourceMappingURL=index.cjs.map
