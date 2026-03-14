/**
 * Internal dependencies
 */
import type { Ability, AbilityCategoryArgs } from '../types';
/**
 * Registers an ability in the store.
 *
 * This action validates the ability before registration. If validation fails,
 * an error will be thrown.
 *
 * @param  ability The ability to register.
 * @return Action object or function.
 * @throws {Error} If validation fails.
 */
export declare function registerAbility(ability: Ability): ({ select, dispatch }: {
    select: any;
    dispatch: any;
}) => void;
/**
 * Returns an action object used to unregister a client-side ability.
 *
 * @param name The name of the ability to unregister.
 * @return Action object.
 */
export declare function unregisterAbility(name: string): {
    type: string;
    name: string;
};
/**
 * Registers a client-side ability category in the store.
 *
 * This action validates the category before registration. If validation fails,
 * an error will be thrown.
 *
 * @param  slug The unique category slug identifier.
 * @param  args Category arguments (label, description, optional meta).
 * @return Action object or function.
 * @throws {Error} If validation fails.
 */
export declare function registerAbilityCategory(slug: string, args: AbilityCategoryArgs): ({ select, dispatch }: {
    select: any;
    dispatch: any;
}) => void;
/**
 * Returns an action object used to unregister a client-side ability category.
 *
 * @param slug The slug of the category to unregister.
 * @return Action object.
 */
export declare function unregisterAbilityCategory(slug: string): {
    type: string;
    slug: string;
};
//# sourceMappingURL=actions.d.ts.map