// packages/abilities/src/store/reducer.ts
import { combineReducers } from "@wordpress/data";
import {
  REGISTER_ABILITY,
  UNREGISTER_ABILITY,
  REGISTER_ABILITY_CATEGORY,
  UNREGISTER_ABILITY_CATEGORY
} from "./constants.mjs";
var ABILITY_KEYS = [
  "name",
  "label",
  "description",
  "category",
  "input_schema",
  "output_schema",
  "meta",
  "callback",
  "permissionCallback"
];
var CATEGORY_KEYS = ["slug", "label", "description", "meta"];
function sanitizeAbility(ability) {
  return Object.keys(ability).filter(
    (key) => ABILITY_KEYS.includes(key) && ability[key] !== void 0
  ).reduce(
    (obj, key) => ({ ...obj, [key]: ability[key] }),
    {}
  );
}
function sanitizeCategory(category) {
  return Object.keys(category).filter(
    (key) => CATEGORY_KEYS.includes(key) && category[key] !== void 0
  ).reduce(
    (obj, key) => ({ ...obj, [key]: category[key] }),
    {}
  );
}
var DEFAULT_STATE = {};
function abilitiesByName(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case REGISTER_ABILITY: {
      if (!action.ability) {
        return state;
      }
      return {
        ...state,
        [action.ability.name]: sanitizeAbility(action.ability)
      };
    }
    case UNREGISTER_ABILITY: {
      if (!state[action.name]) {
        return state;
      }
      const { [action.name]: _, ...newState } = state;
      return newState;
    }
    default:
      return state;
  }
}
var DEFAULT_CATEGORIES_STATE = {};
function categoriesBySlug(state = DEFAULT_CATEGORIES_STATE, action) {
  switch (action.type) {
    case REGISTER_ABILITY_CATEGORY: {
      if (!action.category) {
        return state;
      }
      return {
        ...state,
        [action.category.slug]: sanitizeCategory(action.category)
      };
    }
    case UNREGISTER_ABILITY_CATEGORY: {
      if (!state[action.slug]) {
        return state;
      }
      const { [action.slug]: _, ...newState } = state;
      return newState;
    }
    default:
      return state;
  }
}
var reducer_default = combineReducers({
  abilitiesByName,
  categoriesBySlug
});
export {
  reducer_default as default
};
//# sourceMappingURL=reducer.mjs.map
