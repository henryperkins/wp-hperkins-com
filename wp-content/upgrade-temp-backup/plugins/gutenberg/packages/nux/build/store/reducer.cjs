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

// packages/nux/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  areTipsEnabled: () => areTipsEnabled,
  default: () => reducer_default,
  dismissedTips: () => dismissedTips,
  guides: () => guides
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
function guides(state = [], action) {
  switch (action.type) {
    case "TRIGGER_GUIDE":
      return [...state, action.tipIds];
  }
  return state;
}
function areTipsEnabled(state = true, action) {
  switch (action.type) {
    case "DISABLE_TIPS":
      return false;
    case "ENABLE_TIPS":
      return true;
  }
  return state;
}
function dismissedTips(state = {}, action) {
  switch (action.type) {
    case "DISMISS_TIP":
      return {
        ...state,
        [action.id]: true
      };
    case "ENABLE_TIPS":
      return {};
  }
  return state;
}
var preferences = (0, import_data.combineReducers)({ areTipsEnabled, dismissedTips });
var reducer_default = (0, import_data.combineReducers)({ guides, preferences });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  areTipsEnabled,
  dismissedTips,
  guides
});
//# sourceMappingURL=reducer.cjs.map
