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

// packages/interface/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  getActiveComplementaryArea: () => getActiveComplementaryArea,
  isComplementaryAreaLoading: () => isComplementaryAreaLoading,
  isFeatureActive: () => isFeatureActive,
  isItemPinned: () => isItemPinned,
  isModalActive: () => isModalActive
});
module.exports = __toCommonJS(selectors_exports);
var import_data = require("@wordpress/data");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_preferences = require("@wordpress/preferences");
var import_deprecated2 = require("./deprecated.cjs");
var getActiveComplementaryArea = (0, import_data.createRegistrySelector)(
  (select) => (state, scope) => {
    scope = (0, import_deprecated2.normalizeComplementaryAreaScope)(scope);
    const isComplementaryAreaVisible = select(import_preferences.store).get(
      scope,
      "isComplementaryAreaVisible"
    );
    if (isComplementaryAreaVisible === void 0) {
      return void 0;
    }
    if (isComplementaryAreaVisible === false) {
      return null;
    }
    return state?.complementaryAreas?.[scope];
  }
);
var isComplementaryAreaLoading = (0, import_data.createRegistrySelector)(
  (select) => (state, scope) => {
    scope = (0, import_deprecated2.normalizeComplementaryAreaScope)(scope);
    const isVisible = select(import_preferences.store).get(
      scope,
      "isComplementaryAreaVisible"
    );
    const identifier = state?.complementaryAreas?.[scope];
    return isVisible && identifier === void 0;
  }
);
var isItemPinned = (0, import_data.createRegistrySelector)(
  (select) => (state, scope, item) => {
    scope = (0, import_deprecated2.normalizeComplementaryAreaScope)(scope);
    item = (0, import_deprecated2.normalizeComplementaryAreaName)(scope, item);
    const pinnedItems = select(import_preferences.store).get(
      scope,
      "pinnedItems"
    );
    return pinnedItems?.[item] ?? true;
  }
);
var isFeatureActive = (0, import_data.createRegistrySelector)(
  (select) => (state, scope, featureName) => {
    (0, import_deprecated.default)(
      `select( 'core/interface' ).isFeatureActive( scope, featureName )`,
      {
        since: "6.0",
        alternative: `select( 'core/preferences' ).get( scope, featureName )`
      }
    );
    return !!select(import_preferences.store).get(scope, featureName);
  }
);
function isModalActive(state, modalName) {
  return state.activeModal === modalName;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getActiveComplementaryArea,
  isComplementaryAreaLoading,
  isFeatureActive,
  isItemPinned,
  isModalActive
});
//# sourceMappingURL=selectors.cjs.map
