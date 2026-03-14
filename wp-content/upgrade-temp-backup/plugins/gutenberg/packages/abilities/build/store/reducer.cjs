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

// packages/abilities/src/store/reducer.ts
var reducer_exports = {};
__export(reducer_exports, {
  default: () => reducer_default
});
module.exports = __toCommonJS(reducer_exports);
var import_data = require("@wordpress/data");
var import_constants = require("./constants.cjs");
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
    case import_constants.REGISTER_ABILITY: {
      if (!action.ability) {
        return state;
      }
      return {
        ...state,
        [action.ability.name]: sanitizeAbility(action.ability)
      };
    }
    case import_constants.UNREGISTER_ABILITY: {
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
    case import_constants.REGISTER_ABILITY_CATEGORY: {
      if (!action.category) {
        return state;
      }
      return {
        ...state,
        [action.category.slug]: sanitizeCategory(action.category)
      };
    }
    case import_constants.UNREGISTER_ABILITY_CATEGORY: {
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
var reducer_default = (0, import_data.combineReducers)({
  abilitiesByName,
  categoriesBySlug
});
//# sourceMappingURL=reducer.cjs.map
