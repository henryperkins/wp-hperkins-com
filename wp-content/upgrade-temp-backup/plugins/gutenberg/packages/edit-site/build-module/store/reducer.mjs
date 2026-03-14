// packages/edit-site/src/store/reducer.js
import { combineReducers } from "@wordpress/data";
function settings(state = {}, action) {
  switch (action.type) {
    case "UPDATE_SETTINGS":
      return {
        ...state,
        ...action.settings
      };
  }
  return state;
}
function editedPost(state = {}, action) {
  switch (action.type) {
    case "SET_EDITED_POST":
      return {
        postType: action.postType,
        id: action.id,
        context: action.context
      };
    case "SET_EDITED_POST_CONTEXT":
      return {
        ...state,
        context: action.context
      };
  }
  return state;
}
function saveViewPanel(state = false, action) {
  switch (action.type) {
    case "SET_IS_SAVE_VIEW_OPENED":
      return action.isOpen;
  }
  return state;
}
function routes(state = [], action) {
  switch (action.type) {
    case "REGISTER_ROUTE":
      return [...state, action.route];
    case "UNREGISTER_ROUTE":
      return state.filter((route) => route.name !== action.name);
  }
  return state;
}
var reducer_default = combineReducers({
  settings,
  editedPost,
  saveViewPanel,
  routes
});
export {
  reducer_default as default,
  editedPost,
  saveViewPanel,
  settings
};
//# sourceMappingURL=reducer.mjs.map
