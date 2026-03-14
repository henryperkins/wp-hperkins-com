// packages/interface/src/store/actions.js
import deprecated from "@wordpress/deprecated";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  normalizeComplementaryAreaScope,
  normalizeComplementaryAreaName
} from "./deprecated.mjs";
var setDefaultComplementaryArea = (scope, area) => {
  scope = normalizeComplementaryAreaScope(scope);
  area = normalizeComplementaryAreaName(scope, area);
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
  scope = normalizeComplementaryAreaScope(scope);
  area = normalizeComplementaryAreaName(scope, area);
  const isComplementaryAreaVisible = registry.select(preferencesStore).get(scope, "isComplementaryAreaVisible");
  if (!isComplementaryAreaVisible) {
    registry.dispatch(preferencesStore).set(scope, "isComplementaryAreaVisible", true);
  }
  dispatch({
    type: "ENABLE_COMPLEMENTARY_AREA",
    scope,
    area
  });
};
var disableComplementaryArea = (scope) => ({ registry }) => {
  scope = normalizeComplementaryAreaScope(scope);
  const isComplementaryAreaVisible = registry.select(preferencesStore).get(scope, "isComplementaryAreaVisible");
  if (isComplementaryAreaVisible) {
    registry.dispatch(preferencesStore).set(scope, "isComplementaryAreaVisible", false);
  }
};
var pinItem = (scope, item) => ({ registry }) => {
  if (!item) {
    return;
  }
  scope = normalizeComplementaryAreaScope(scope);
  item = normalizeComplementaryAreaName(scope, item);
  const pinnedItems = registry.select(preferencesStore).get(scope, "pinnedItems");
  if (pinnedItems?.[item] === true) {
    return;
  }
  registry.dispatch(preferencesStore).set(scope, "pinnedItems", {
    ...pinnedItems,
    [item]: true
  });
};
var unpinItem = (scope, item) => ({ registry }) => {
  if (!item) {
    return;
  }
  scope = normalizeComplementaryAreaScope(scope);
  item = normalizeComplementaryAreaName(scope, item);
  const pinnedItems = registry.select(preferencesStore).get(scope, "pinnedItems");
  registry.dispatch(preferencesStore).set(scope, "pinnedItems", {
    ...pinnedItems,
    [item]: false
  });
};
function toggleFeature(scope, featureName) {
  return function({ registry }) {
    deprecated(`dispatch( 'core/interface' ).toggleFeature`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).toggle`
    });
    registry.dispatch(preferencesStore).toggle(scope, featureName);
  };
}
function setFeatureValue(scope, featureName, value) {
  return function({ registry }) {
    deprecated(`dispatch( 'core/interface' ).setFeatureValue`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).set`
    });
    registry.dispatch(preferencesStore).set(scope, featureName, !!value);
  };
}
function setFeatureDefaults(scope, defaults) {
  return function({ registry }) {
    deprecated(`dispatch( 'core/interface' ).setFeatureDefaults`, {
      since: "6.0",
      alternative: `dispatch( 'core/preferences' ).setDefaults`
    });
    registry.dispatch(preferencesStore).setDefaults(scope, defaults);
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
export {
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
};
//# sourceMappingURL=actions.mjs.map
