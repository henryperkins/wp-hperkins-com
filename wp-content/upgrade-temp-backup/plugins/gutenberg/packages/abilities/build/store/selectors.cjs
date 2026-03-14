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

// packages/abilities/src/store/selectors.ts
var selectors_exports = {};
__export(selectors_exports, {
  getAbilities: () => getAbilities,
  getAbility: () => getAbility,
  getAbilityCategories: () => getAbilityCategories,
  getAbilityCategory: () => getAbilityCategory
});
module.exports = __toCommonJS(selectors_exports);
var import_data = require("@wordpress/data");
var getAbilities = (0, import_data.createSelector)(
  (state, { category } = {}) => {
    const abilities = Object.values(state.abilitiesByName);
    if (category) {
      return abilities.filter(
        (ability) => ability.category === category
      );
    }
    return abilities;
  },
  (state, { category } = {}) => [
    state.abilitiesByName,
    category
  ]
);
function getAbility(state, name) {
  return state.abilitiesByName[name];
}
var getAbilityCategories = (0, import_data.createSelector)(
  (state) => {
    return Object.values(state.categoriesBySlug);
  },
  (state) => [state.categoriesBySlug]
);
function getAbilityCategory(state, slug) {
  return state.categoriesBySlug[slug];
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAbilities,
  getAbility,
  getAbilityCategories,
  getAbilityCategory
});
//# sourceMappingURL=selectors.cjs.map
