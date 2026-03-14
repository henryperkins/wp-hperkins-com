// packages/nux/src/store/selectors.js
import { createSelector } from "@wordpress/data";
var getAssociatedGuide = createSelector(
  (state, tipId) => {
    for (const tipIds of state.guides) {
      if (tipIds.includes(tipId)) {
        const nonDismissedTips = tipIds.filter(
          (tId) => !Object.keys(
            state.preferences.dismissedTips
          ).includes(tId)
        );
        const [currentTipId = null, nextTipId = null] = nonDismissedTips;
        return { tipIds, currentTipId, nextTipId };
      }
    }
    return null;
  },
  (state) => [state.guides, state.preferences.dismissedTips]
);
function isTipVisible(state, tipId) {
  if (!state.preferences.areTipsEnabled) {
    return false;
  }
  if (state.preferences.dismissedTips?.hasOwnProperty(tipId)) {
    return false;
  }
  const associatedGuide = getAssociatedGuide(state, tipId);
  if (associatedGuide && associatedGuide.currentTipId !== tipId) {
    return false;
  }
  return true;
}
function areTipsEnabled(state) {
  return state.preferences.areTipsEnabled;
}
export {
  areTipsEnabled,
  getAssociatedGuide,
  isTipVisible
};
//# sourceMappingURL=selectors.mjs.map
