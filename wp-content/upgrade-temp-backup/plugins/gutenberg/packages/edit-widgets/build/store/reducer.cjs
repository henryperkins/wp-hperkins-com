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

// packages/edit-widgets/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  blockInserterPanel: () => blockInserterPanel,
  default: () => reducer_default,
  inserterSidebarToggleRef: () => inserterSidebarToggleRef,
  listViewPanel: () => listViewPanel,
  listViewToggleRef: () => listViewToggleRef,
  widgetAreasOpenState: () => widgetAreasOpenState,
  widgetSavingLock: () => widgetSavingLock
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
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
var reducer_default = (0, import_data.combineReducers)({
  blockInserterPanel,
  inserterSidebarToggleRef,
  listViewPanel,
  listViewToggleRef,
  widgetAreasOpenState,
  widgetSavingLock
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  blockInserterPanel,
  inserterSidebarToggleRef,
  listViewPanel,
  listViewToggleRef,
  widgetAreasOpenState,
  widgetSavingLock
});
//# sourceMappingURL=reducer.cjs.map
