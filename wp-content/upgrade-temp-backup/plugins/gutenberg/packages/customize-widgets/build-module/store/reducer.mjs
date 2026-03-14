// packages/customize-widgets/src/store/reducer.js
import { combineReducers } from "@wordpress/data";
function blockInserterPanel(state = false, action) {
  switch (action.type) {
    case "SET_IS_INSERTER_OPENED":
      return action.value;
  }
  return state;
}
var reducer_default = combineReducers({
  blockInserterPanel
});
export {
  reducer_default as default
};
//# sourceMappingURL=reducer.mjs.map
