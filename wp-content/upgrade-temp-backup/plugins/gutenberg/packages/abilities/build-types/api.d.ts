import type { Ability, AbilityCategory, AbilityCategoryArgs, AbilitiesQueryArgs, AbilityInput, AbilityOutput } from './types';
/**
 * Get all available abilities with optional filtering.
 *
 * @param args Optional query arguments to filter. Defaults to empty object.
 * @return Array of abilities.
 */
export declare function getAbilities(args?: AbilitiesQueryArgs): Ability[];
/**
 * Get a specific ability by name.
 *
 * @param name The ability name.
 * @return The ability or undefined if not found.
 */
export declare function getAbility(name: string): Ability | undefined;
/**
 * Get all available ability categories.
 *
 * @return Array of categories.
 */
export declare function getAbilityCategories(): AbilityCategory[];
/**
 * Get a specific ability category by slug.
 *
 * @param slug The category slug.
 * @return The category or undefined if not found.
 */
export declare function getAbilityCategory(slug: string): AbilityCategory | undefined;
/**
 * Register a client-side ability.
 *
 * Client abilities are executed locally in the browser and must include
 * a callback function. The ability will be validated by the store action,
 * and an error will be thrown if validation fails.
 *
 * The category must already be registered before registering abilities.
 *
 * @param  ability The ability definition including callback.
 * @throws {Error} If the ability fails validation.
 *
 * @example
 * ```js
 * registerAbility({
 *   name: 'my-plugin/navigate',
 *   label: 'Navigate to URL',
 *   description: 'Navigates to a URL within WordPress admin',
 *   category: 'navigation',
 *   input_schema: {
 *     type: 'object',
 *     properties: {
 *       url: { type: 'string' }
 *     },
 *     required: ['url']
 *   },
 *   callback: async ({ url }) => {
 *     window.location.href = url;
 *     return { success: true };
 *   }
 * });
 * ```
 */
export declare function registerAbility(ability: Ability): void;
/**
 * Unregister an ability from the store.
 *
 * Remove a client-side ability from the store.
 * Note: This will return an error for server-side abilities.
 *
 * @param name The ability name to unregister.
 */
export declare function unregisterAbility(name: string): void;
/**
 * Register a client-side ability category.
 *
 * Categories registered on the client are stored alongside server-side categories
 * in the same store and can be used when registering client side abilities.
 * This is useful when registering client-side abilities that introduce new
 * categories not defined by the server.
 *
 * @param  slug Category slug (lowercase alphanumeric with dashes only).
 * @param  args Category arguments (label, description, optional meta).
 * @throws {Error} If the category fails validation.
 *
 * @example
 * ```js
 * // Register a new category for block editor abilities
 * registerAbilityCategory('block-editor', {
 *   label: 'Block Editor',
 *   description: 'Abilities for interacting with the WordPress block editor'
 * });
 *
 * // Then register abilities using this category
 * registerAbility({
 *   name: 'my-plugin/insert-block',
 *   label: 'Insert Block',
 *   description: 'Inserts a block into the editor',
 *   category: 'block-editor',
 *   callback: async ({ blockType }) => {
 *     // Implementation
 *     return { success: true };
 *   }
 * });
 * ```
 */
export declare function registerAbilityCategory(slug: string, args: AbilityCategoryArgs): void;
/**
 * Unregister an ability category.
 *
 * Removes a category from the store.
 *
 * @param slug The category slug to unregister.
 *
 * @example
 * ```js
 * unregisterAbilityCategory('block-editor');
 * ```
 */
export declare function unregisterAbilityCategory(slug: string): void;
/**
 * Execute an ability.
 *
 * Executes abilities with validation for client-side abilities only.
 * Server abilities bypass validation as it's handled on the server.
 *
 * @param name  The ability name.
 * @param input Optional input parameters for the ability.
 * @return Promise resolving to the ability execution result.
 * @throws Error if the ability is not found or execution fails.
 */
export declare function executeAbility(name: string, input?: AbilityInput): Promise<AbilityOutput>;
//# sourceMappingURL=api.d.ts.map