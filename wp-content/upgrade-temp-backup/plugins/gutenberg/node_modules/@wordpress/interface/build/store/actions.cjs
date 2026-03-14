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

// packages/interface/src/store/actions.js
var actions_exports = {};
__export(actions_exports, {
  closeModal: () => closeModal,
  disableComplementaryArea: () => disableComplementaryArea,
  enableComplementaryArea: () => enableComplementaryArea,
  openModal: () => openModal,
  pinItem: () => pinItem,
  setDefaultComplementaryArea: () => setDefaultComplementaryArea,
  setFeatureDefaults: () => setFeatureDefaults,
  setFeatureValue: () => setFeatureValue,
  toggleFeature: () => toggleFeature,
  unpinItem: () => unpinItem
});
module.exports = __toCommonJS(actions_exports);
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_preferences = require("@wordpress/preferences");
var import_deprecated2 = require("./deprecated.cjs");
var setDefaultComplementaryArea = (scope, area) => {
  scope = (0, import_deprecated2.normalizeComplementaryAreaScope)(scope);
  area = (0, import_deprecated2.normalizeComplementaryAreaName)(scope, area);
  return {
    type: "SET_DEFAULT_COMPLEMENTARY_AREA",
    scope,
    area
  };
};
var enableComplementaryArea = (scope, area) => ({ registry, dispatch }) => {
  if (!area) {
    return;
  }
  scope = (0, import_deprecated2.normalizeComplementaryAreaScope)(scope);
  area = (0, import_deprecated2.normalizeComplementaryAreaName)(scope, area);
  const isComplementaryAreaVisible = registry.select(import_preferences.store).get(scope, "isComplementaryAreaVisible");
  if (!isComplementaryAreaVisible) {
    registry.dispatch(import_preferences.store).set(scope, "isComplementaryAreaVisible", true);
  }
  dispatch({
    type: "ENABLE_COMPLEMENTARY_AREA",
    scope,
    area
  });
};
var disableComplementaryArea = (scope) => ({ registry }) => {
  scope = (0, import_deprecated2.normalizeComplementaryAreaScope)(scope);
  const isComplementaryAreaVisible = registry.select(import_preferences.store).get(scope, "isComplementaryAreaVisible");
  if (isComplementaryAreaVisible) {
    registry.dispatch(import_preferences.store).set(scope, "isComplementaryAreaVisible", false);
  }
};
var pinItem = (scope, item) => ({ registry }) => {
  if (!item) {
    return;
  }
  scope = (0, import_deprecated2.normalizeComplementaryAreaScope)(scope);
  item = (0, import_deprecated2.normalizeComplementaryAreaName)(scope, item);
  const pinnedItems = registry.select(import_preferences.store).get(scope, "pinnedItems");
  if (pinnedItems?.[item] === true) {
    return;
  }
  registry.dispatch(import_preferences.store).set(scope, "pinnedItems", {
    ...pinnedItems,
    [item]: true
  });
};
var unpinItem = (scope, item) => ({ registry }) => {
  if (!item) {
    return;
  }
  scope = (0, import_deprecated2.normalizeComplementaryAreaScope)(scope);
  item = (0, import_deprecated2.normalizeComplementaryAreaName)(scope, item);
  const pinnedItems = registry.select(import_preferences.store).get(scope, "pinnedItems");
  registry.dispatch(import_preferences.store).set(scope, "pinnedItems", {
    ...pinnedItems,
    [item]: false
  });
};
function toggleFeature(scope, featureName) {
  return function({ registry }) {
    (0, import_deprecated.default)(`dispatch( 'core/interface' ).toggleFeature`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).toggle`
    });
    registry.dispatch(import_preferences.store).toggle(scope, featureName);
  };
}
function setFeatureValue(scope, featureName, value) {
  return function({ registry }) {
    (0, import_deprecated.default)(`dispatch( 'core/interface' ).setFeatureValue`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).set`
    });
    registry.dispatch(import_preferences.store).set(scope, featureName, !!value);
  };
}
function setFeatureDefaults(scope, defaults) {
  return function({ registry }) {
    (0, import_deprecated.default)(`dispatch( 'core/interface' ).setFeatureDefaults`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).setDefaults`
    });
    registry.dispatch(import_preferences.store).setDefaults(scope, defaults);
  };
}
function openModal(name) {
  return {
    type: "OPEN_MODAL",
    name
  };
}
function closeModal() {
  return {
    type: "CLOSE_MODAL"
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  closeModal,
  disableComplementaryArea,
  enableComplementaryArea,
  openModal,
  pinItem,
  setDefaultComplementaryArea,
  setFeatureDefaults,
  setFeatureValue,
  toggleFeature,
  unpinItem
});
//# sourceMappingURL=actions.cjs.map
