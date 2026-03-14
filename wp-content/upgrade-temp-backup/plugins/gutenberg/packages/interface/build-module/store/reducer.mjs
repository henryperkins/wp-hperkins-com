// packages/interface/src/store/reducer.js
import { combineReducers } from "@wordpress/data";
function complementaryAreas(state = {}, action) {
  switch (action.type) {
    case "SET_DEFAULT_COMPLEMENTARY_AREA": {
      const { scope, area } = action;
      if (state[scope]) {
        return state;
      }
      return {
        ...state,
        [scope]: area
      };
    }
    case "ENABLE_COMPLEMENTARY_AREA": {
      const { scope, area } = action;
      return {
        ...state,
        [scope]: area
      };
    }
  }
  return state;
}
function activeModal(state = null, action) {
  switch (action.type) {
    case "OPEN_MODAL":
      return action.name;
    case "CLOSE_MODAL":
      return null;
  }
  return state;
}
var reducer_default = combineReducers({
  complementaryAreas,
  activeModal
});
export {
  activeModal,
  complementaryAreas,
  reducer_default as default
};
//# sourceMappingURL=reducer.mjs.map
