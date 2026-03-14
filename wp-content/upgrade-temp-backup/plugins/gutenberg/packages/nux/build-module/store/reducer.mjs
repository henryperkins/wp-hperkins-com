// packages/nux/src/store/reducer.js
import { combineReducers } from "@wordpress/data";
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
var preferences = combineReducers({ areTipsEnabled, dismissedTips });
var reducer_default = combineReducers({ guides, preferences });
export {
  areTipsEnabled,
  reducer_default as default,
  dismissedTips,
  guides
};
//# sourceMappingURL=reducer.mjs.map
