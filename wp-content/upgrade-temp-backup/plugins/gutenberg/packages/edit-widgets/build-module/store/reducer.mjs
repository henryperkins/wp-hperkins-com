// packages/edit-widgets/src/store/reducer.js
import { combineReducers } from "@wordpress/data";
function widgetAreasOpenState(state = {}, action) {
  const { type } = action;
  switch (type) {
    case "SET_WIDGET_AREAS_OPEN_STATE": {
      return action.widgetAreasOpenState;
    }
    case "SET_IS_WIDGET_AREA_OPEN": {
      const { clientId, isOpen } = action;
      return {
        ...state,
        [clientId]: isOpen
      };
    }
    default: {
      return state;
    }
  }
}
function blockInserterPanel(state = false, action) {
  switch (action.type) {
    case "SET_IS_LIST_VIEW_OPENED":
      return action.isOpen ? false : state;
    case "SET_IS_INSERTER_OPENED":
      return action.value;
  }
  return state;
}
function listViewPanel(state = false, action) {
  switch (action.type) {
    case "SET_IS_INSERTER_OPENED":
      return action.value ? false : state;
    case "SET_IS_LIST_VIEW_OPENED":
      return action.isOpen;
  }
  return state;
}
function listViewToggleRef(state = { current: null }) {
  return state;
}
function inserterSidebarToggleRef(state = { current: null }) {
  return state;
}
function widgetSavingLock(state = {}, action) {
  switch (action.type) {
    case "LOCK_WIDGET_SAVING":
      return { ...state, [action.lockName]: true };
    case "UNLOCK_WIDGET_SAVING": {
      const { [action.lockName]: removedLockName, ...restState } = state;
      return restState;
    }
  }
  return state;
}
var reducer_default = combineReducers({
  blockInserterPanel,
  inserterSidebarToggleRef,
  listViewPanel,
  listViewToggleRef,
  widgetAreasOpenState,
  widgetSavingLock
});
export {
  blockInserterPanel,
  reducer_default as default,
  inserterSidebarToggleRef,
  listViewPanel,
  listViewToggleRef,
  widgetAreasOpenState,
  widgetSavingLock
};
//# sourceMappingURL=reducer.mjs.map
