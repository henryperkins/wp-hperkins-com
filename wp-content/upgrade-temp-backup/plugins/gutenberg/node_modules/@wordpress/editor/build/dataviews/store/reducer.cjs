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

// packages/editor/src/dataviews/store/reducer.ts
var reducer_exports = {};
__export(reducer_exports, {
  default: () => reducer_default
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
function isReady(state = {}, action) {
  switch (action.type) {
    case "SET_IS_READY":
      return {
        ...state,
        [action.kind]: {
          ...state[action.kind],
          [action.name]: true
        }
      };
  }
  return state;
}
function actions(state = {}, action) {
  switch (action.type) {
    case "REGISTER_ENTITY_ACTION":
      return {
        ...state,
        [action.kind]: {
          ...state[action.kind],
          [action.name]: [
            ...(state[action.kind]?.[action.name] ?? []).filter(
              (_action) => _action.id !== action.config.id
            ),
            action.config
          ]
        }
      };
    case "UNREGISTER_ENTITY_ACTION": {
      return {
        ...state,
        [action.kind]: {
          ...state[action.kind],
          [action.name]: (state[action.kind]?.[action.name] ?? []).filter((_action) => _action.id !== action.actionId)
        }
      };
    }
  }
  return state;
}
function fields(state = {}, action) {
  switch (action.type) {
    case "REGISTER_ENTITY_FIELD":
      return {
        ...state,
        [action.kind]: {
          ...state[action.kind],
          [action.name]: [
            ...(state[action.kind]?.[action.name] ?? []).filter(
              (_field) => _field.id !== action.config.id
            ),
            action.config
          ]
        }
      };
    case "UNREGISTER_ENTITY_FIELD":
      return {
        ...state,
        [action.kind]: {
          ...state[action.kind],
          [action.name]: (state[action.kind]?.[action.name] ?? []).filter((_field) => _field.id !== action.fieldId)
        }
      };
  }
  return state;
}
var reducer_default = (0, import_data.combineReducers)({
  actions,
  fields,
  isReady
});
//# sourceMappingURL=reducer.cjs.map
