// packages/reusable-blocks/src/store/reducer.js
import { combineReducers } from "@wordpress/data";
function isEditingReusableBlock(state = {}, action) {
  if (action?.type === "SET_EDITING_REUSABLE_BLOCK") {
    return {
      ...state,
      [action.clientId]: action.isEditing
    };
  }
  return state;
}
var reducer_default = combineReducers({
  isEditingReusableBlock
});
export {
  reducer_default as default,
  isEditingReusableBlock
};
//# sourceMappingURL=reducer.mjs.map
