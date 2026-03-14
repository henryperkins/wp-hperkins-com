var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/nux/src/store/selectors.js
var selectors_exports = {};
__export(selectors_exports, {
  areTipsEnabled: () => areTipsEnabled,
  getAssociatedGuide: () => getAssociatedGuide,
  isTipVisible: () => isTipVisible
});
module.exports = __toCommonJS(selectors_exports);
var import_data = require("@wordpress/data");
var getAssociatedGuide = (0, import_data.createSelector)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  areTipsEnabled,
  getAssociatedGuide,
  isTipVisible
});
//# sourceMappingURL=selectors.cjs.map
