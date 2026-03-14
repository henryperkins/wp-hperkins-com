// packages/abilities/src/api.ts
import { dispatch, select } from "@wordpress/data";
import { sprintf } from "@wordpress/i18n";
import { store } from "./store/index.mjs";
import { validateValueFromSchema } from "./validation.mjs";
function getAbilities(args = {}) {
  return select(store).getAbilities(args);
}
function getAbility(name) {
  return select(store).getAbility(name);
}
function getAbilityCategories() {
  return select(store).getAbilityCategories();
}
function getAbilityCategory(slug) {
  return select(store).getAbilityCategory(slug);
}
function registerAbility(ability) {
  dispatch(store).registerAbility(ability);
}
function unregisterAbility(name) {
  dispatch(store).unregisterAbility(name);
}
function registerAbilityCategory(slug, args) {
  dispatch(store).registerAbilityCategory(slug, args);
}
function unregisterAbilityCategory(slug) {
  dispatch(store).unregisterAbilityCategory(slug);
}
async function executeAbility(name, input) {
  const ability = getAbility(name);
  if (!ability) {
    throw new Error(sprintf("Ability not found: %s", name));
  }
  if (!ability.callback) {
    throw new Error(
      sprintf(
        'Ability "%s" is missing callback. Please ensure the ability is properly registered.',
        ability.name
      )
    );
  }
  if (ability.permissionCallback) {
    const hasPermission = await ability.permissionCallback(input);
    if (!hasPermission) {
      const error = new Error(
        sprintf("Permission denied for ability: %s", ability.name)
      );
      error.code = "ability_permission_denied";
      throw error;
    }
  }
  if (ability.input_schema) {
    const inputValidation = validateValueFromSchema(
      input,
      ability.input_schema,
      "input"
    );
    if (inputValidation !== true) {
      const error = new Error(
        sprintf(
          'Ability "%1$s" has invalid input. Reason: %2$s',
          ability.name,
          inputValidation
        )
      );
      error.code = "ability_invalid_input";
      throw error;
    }
  }
  let result;
  try {
    result = await ability.callback(input);
  } catch (error) {
    console.error(`Error executing ability ${ability.name}:`, error);
    throw error;
  }
  if (ability.output_schema) {
    const outputValidation = validateValueFromSchema(
      result,
      ability.output_schema,
      "output"
    );
    if (outputValidation !== true) {
      const error = new Error(
        sprintf(
          'Ability "%1$s" has invalid output. Reason: %2$s',
          ability.name,
          outputValidation
        )
      );
      error.code = "ability_invalid_output";
      throw error;
    }
  }
  return result;
}
export {
  executeAbility,
  getAbilities,
  getAbility,
  getAbilityCategories,
  getAbilityCategory,
  registerAbility,
  registerAbilityCategory,
  unregisterAbility,
  unregisterAbilityCategory
};
//# sourceMappingURL=api.mjs.map
