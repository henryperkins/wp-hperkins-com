"use strict";
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

// packages/edit-site/src/store/reducer.js
var reducer_exports = {};
__export(reducer_exports, {
  default: () => reducer_default,
  editedPost: () => editedPost,
  saveViewPanel: () => saveViewPanel,
  settings: () => settings
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
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
var reducer_default = (0, import_data.combineReducers)({
  settings,
  editedPost,
  saveViewPanel,
  routes
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  editedPost,
  saveViewPanel,
  settings
});
//# sourceMappingURL=reducer.cjs.map
