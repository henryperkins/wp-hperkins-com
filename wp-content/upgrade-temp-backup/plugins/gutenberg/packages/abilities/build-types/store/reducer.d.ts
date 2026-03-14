/**
 * Internal dependencies
 */
import type { Ability, AbilityCategory } from '../types';
import { REGISTER_ABILITY, UNREGISTER_ABILITY, REGISTER_ABILITY_CATEGORY, UNREGISTER_ABILITY_CATEGORY } from './constants';
interface RegisterAbilityAction {
    type: typeof REGISTER_ABILITY;
    ability: Ability;
}
interface UnregisterAbilityAction {
    type: typeof UNREGISTER_ABILITY;
    name: string;
}
interface RegisterAbilityCategoryAction {
    type: typeof REGISTER_ABILITY_CATEGORY;
    category: AbilityCategory;
}
interface UnregisterAbilityCategoryAction {
    type: typeof UNREGISTER_ABILITY_CATEGORY;
    slug: string;
}
type AbilitiesAction = RegisterAbilityAction | UnregisterAbilityAction;
type AbilitiesCategoryAction = RegisterAbilityCategoryAction | UnregisterAbilityCategoryAction;
declare const _default: import("redux").Reducer<{
    abilitiesByName: Record<string, Ability>;
    categoriesBySlug: Record<string, AbilityCategory>;
}, AbilitiesAction | AbilitiesCategoryAction, Partial<{
    abilitiesByName: never;
    categoriesBySlug: never;
}>>;
export default _default;
//# sourceMappingURL=reducer.d.ts.map