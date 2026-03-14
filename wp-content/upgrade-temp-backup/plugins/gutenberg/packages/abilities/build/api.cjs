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

// packages/abilities/src/api.ts
var api_exports = {};
__export(api_exports, {
  executeAbility: () => executeAbility,
  getAbilities: () => getAbilities,
  getAbility: () => getAbility,
  getAbilityCategories: () => getAbilityCategories,
  getAbilityCategory: () => getAbilityCategory,
  registerAbility: () => registerAbility,
  registerAbilityCategory: () => registerAbilityCategory,
  unregisterAbility: () => unregisterAbility,
  unregisterAbilityCategory: () => unregisterAbilityCategory
});
module.exports = __toCommonJS(api_exports);
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_store = require("./store/index.cjs");
var import_validation = require("./validation.cjs");
function getAbilities(args = {}) {
  return (0, import_data.select)(import_store.store).getAbilities(args);
}
function getAbility(name) {
  return (0, import_data.select)(import_store.store).getAbility(name);
}
function getAbilityCategories() {
  return (0, import_data.select)(import_store.store).getAbilityCategories();
}
function getAbilityCategory(slug) {
  return (0, import_data.select)(import_store.store).getAbilityCategory(slug);
}
function registerAbility(ability) {
  (0, import_data.dispatch)(import_store.store).registerAbility(ability);
}
function unregisterAbility(name) {
  (0, import_data.dispatch)(import_store.store).unregisterAbility(name);
}
function registerAbilityCategory(slug, args) {
  (0, import_data.dispatch)(import_store.store).registerAbilityCategory(slug, args);
}
function unregisterAbilityCategory(slug) {
  (0, import_data.dispatch)(import_store.store).unregisterAbilityCategory(slug);
}
async function executeAbility(name, input) {
  const ability = getAbility(name);
  if (!ability) {
    throw new Error((0, import_i18n.sprintf)("Ability not found: %s", name));
  }
  if (!ability.callback) {
    throw new Error(
      (0, import_i18n.sprintf)(
        'Ability "%s" is missing callback. Please ensure the ability is properly registered.',
        ability.name
      )
    );
  }
  if (ability.permissionCallback) {
    const hasPermission = await ability.permissionCallback(input);
    if (!hasPermission) {
      const error = new Error(
        (0, import_i18n.sprintf)("Permission denied for ability: %s", ability.name)
      );
      error.code = "ability_permission_denied";
      throw error;
    }
  }
  if (ability.input_schema) {
    const inputValidation = (0, import_validation.validateValueFromSchema)(
      input,
      ability.input_schema,
      "input"
    );
    if (inputValidation !== true) {
      const error = new Error(
        (0, import_i18n.sprintf)(
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
    const outputValidation = (0, import_validation.validateValueFromSchema)(
      result,
      ability.output_schema,
      "output"
    );
    if (outputValidation !== true) {
      const error = new Error(
        (0, import_i18n.sprintf)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  executeAbility,
  getAbilities,
  getAbility,
  getAbilityCategories,
  getAbilityCategory,
  registerAbility,
  registerAbilityCategory,
  unregisterAbility,
  unregisterAbilityCategory
});
//# sourceMappingURL=api.cjs.map
