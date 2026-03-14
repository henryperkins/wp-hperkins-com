// packages/interface/src/store/selectors.js
import { createRegistrySelector } from "@wordpress/data";
import deprecated from "@wordpress/deprecated";
import { store as preferencesStore } from "@wordpress/preferences";
import {
  normalizeComplementaryAreaScope,
  normalizeComplementaryAreaName
} from "./deprecated.mjs";
var getActiveComplementaryArea = createRegistrySelector(
  (select) => (state, scope) => {
    scope = normalizeComplementaryAreaScope(scope);
    const isComplementaryAreaVisible = select(preferencesStore).get(
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
var isComplementaryAreaLoading = createRegistrySelector(
  (select) => (state, scope) => {
    scope = normalizeComplementaryAreaScope(scope);
    const isVisible = select(preferencesStore).get(
      scope,
      "isComplementaryAreaVisible"
    );
    const identifier = state?.complementaryAreas?.[scope];
    return isVisible && identifier === void 0;
  }
);
var isItemPinned = createRegistrySelector(
  (select) => (state, scope, item) => {
    scope = normalizeComplementaryAreaScope(scope);
    item = normalizeComplementaryAreaName(scope, item);
    const pinnedItems = select(preferencesStore).get(
      scope,
      "pinnedItems"
    );
    return pinnedItems?.[item] ?? true;
  }
);
var isFeatureActive = createRegistrySelector(
  (select) => (state, scope, featureName) => {
    deprecated(
      `select( 'core/interface' ).isFeatureActive( scope, featureName )`,
      {
        since: "6.0",
        alternative: `select( 'core/preferences' ).get( scope, featureName )`
      }
    );
    return !!select(preferencesStore).get(scope, featureName);
  }
);
function isModalActive(state, modalName) {
  return state.activeModal === modalName;
}
export {
  getActiveComplementaryArea,
  isComplementaryAreaLoading,
  isFeatureActive,
  isItemPinned,
  isModalActive
};
//# sourceMappingURL=selectors.mjs.map
