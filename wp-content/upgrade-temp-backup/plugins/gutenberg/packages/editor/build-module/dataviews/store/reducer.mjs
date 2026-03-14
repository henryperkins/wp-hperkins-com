// packages/editor/src/dataviews/store/reducer.ts
import { combineReducers } from "@wordpress/data";
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
var reducer_default = combineReducers({
  actions,
  fields,
  isReady
});
export {
  reducer_default as default
};
//# sourceMappingURL=reducer.mjs.map
