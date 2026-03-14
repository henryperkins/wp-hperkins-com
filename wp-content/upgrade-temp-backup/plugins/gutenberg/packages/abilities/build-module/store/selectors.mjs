// packages/abilities/src/store/selectors.ts
import { createSelector } from "@wordpress/data";
var getAbilities = createSelector(
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
var getAbilityCategories = createSelector(
  (state) => {
    return Object.values(state.categoriesBySlug);
  },
  (state) => [state.categoriesBySlug]
);
function getAbilityCategory(state, slug) {
  return state.categoriesBySlug[slug];
}
export {
  getAbilities,
  getAbility,
  getAbilityCategories,
  getAbilityCategory
};
//# sourceMappingURL=selectors.mjs.map
