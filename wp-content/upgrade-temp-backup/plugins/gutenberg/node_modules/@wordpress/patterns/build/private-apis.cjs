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

// packages/patterns/src/private-apis.js
var private_apis_exports = {};
__export(private_apis_exports, {
  privateApis: () => privateApis
});
module.exports = __toCommonJS(private_apis_exports);
var import_lock_unlock = require("./lock-unlock.cjs");
var import_overrides_panel = __toESM(require("./components/overrides-panel.cjs"));
var import_create_pattern_modal = __toESM(require("./components/create-pattern-modal.cjs"));
var import_duplicate_pattern_modal = __toESM(require("./components/duplicate-pattern-modal.cjs"));
var import_api = require("./api/index.cjs");
var import_rename_pattern_modal = __toESM(require("./components/rename-pattern-modal.cjs"));
var import_components = __toESM(require("./components/index.cjs"));
var import_rename_pattern_category_modal = __toESM(require("./components/rename-pattern-category-modal.cjs"));
var import_pattern_overrides_controls = __toESM(require("./components/pattern-overrides-controls.cjs"));
var import_reset_overrides_control = __toESM(require("./components/reset-overrides-control.cjs"));
var import_private_hooks = require("./private-hooks.cjs");
var import_constants = require("./constants.cjs");
var privateApis = {};
(0, import_lock_unlock.lock)(privateApis, {
  OverridesPanel: import_overrides_panel.default,
  CreatePatternModal: import_create_pattern_modal.default,
  CreatePatternModalContents: import_create_pattern_modal.CreatePatternModalContents,
  DuplicatePatternModal: import_duplicate_pattern_modal.default,
  isOverridableBlock: import_api.isOverridableBlock,
  useDuplicatePatternProps: import_duplicate_pattern_modal.useDuplicatePatternProps,
  RenamePatternModal: import_rename_pattern_modal.default,
  PatternsMenuItems: import_components.default,
  RenamePatternCategoryModal: import_rename_pattern_category_modal.default,
  PatternOverridesControls: import_pattern_overrides_controls.default,
  ResetOverridesControl: import_reset_overrides_control.default,
  useAddPatternCategory: import_private_hooks.useAddPatternCategory,
  PATTERN_TYPES: import_constants.PATTERN_TYPES,
  PATTERN_DEFAULT_CATEGORY: import_constants.PATTERN_DEFAULT_CATEGORY,
  PATTERN_USER_CATEGORY: import_constants.PATTERN_USER_CATEGORY,
  EXCLUDED_PATTERN_SOURCES: import_constants.EXCLUDED_PATTERN_SOURCES,
  PATTERN_SYNC_TYPES: import_constants.PATTERN_SYNC_TYPES
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  privateApis
});
//# sourceMappingURL=private-apis.cjs.map
