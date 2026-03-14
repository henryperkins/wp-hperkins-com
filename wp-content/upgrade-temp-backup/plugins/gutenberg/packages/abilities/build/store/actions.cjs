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

// packages/abilities/src/store/actions.ts
var actions_exports = {};
__export(actions_exports, {
  registerAbility: () => registerAbility,
  registerAbilityCategory: () => registerAbilityCategory,
  unregisterAbility: () => unregisterAbility,
  unregisterAbilityCategory: () => unregisterAbilityCategory
});
module.exports = __toCommonJS(actions_exports);
var import_i18n = require("@wordpress/i18n");
var import_constants = require("./constants.cjs");
function filterAnnotations(sourceAnnotations, allowedKeys) {
  const annotations = {};
  if (sourceAnnotations) {
    for (const key of allowedKeys) {
      if (sourceAnnotations[key] !== void 0) {
        annotations[key] = sourceAnnotations[key];
      }
    }
  }
  return annotations;
}
function registerAbility(ability) {
  return ({ select, dispatch }) => {
    if (!ability.name) {
      throw new Error("Ability name is required");
    }
    if (!import_constants.ABILITY_NAME_PATTERN.test(ability.name)) {
      throw new Error(
        'Ability name must be a string containing a namespace prefix with 2-4 segments, e.g. "my-plugin/my-ability" or "core/posts/find". It can only contain lowercase alphanumeric characters, dashes and the forward slash.'
      );
    }
    if (!ability.label) {
      throw new Error(
        (0, import_i18n.sprintf)('Ability "%s" must have a label', ability.name)
      );
    }
    if (!ability.description) {
      throw new Error(
        (0, import_i18n.sprintf)('Ability "%s" must have a description', ability.name)
      );
    }
    if (!ability.category) {
      throw new Error(
        (0, import_i18n.sprintf)('Ability "%s" must have a category', ability.name)
      );
    }
    if (!import_constants.CATEGORY_SLUG_PATTERN.test(ability.category)) {
      throw new Error(
        (0, import_i18n.sprintf)(
          'Ability "%1$s" has an invalid category. Category must be lowercase alphanumeric with dashes only. Got: "%2$s"',
          ability.name,
          ability.category
        )
      );
    }
    const categories = select.getAbilityCategories();
    const existingCategory = categories.find(
      (cat) => cat.slug === ability.category
    );
    if (!existingCategory) {
      throw new Error(
        (0, import_i18n.sprintf)(
          'Ability "%1$s" references non-existent category "%2$s". Please register the category first.',
          ability.name,
          ability.category
        )
      );
    }
    if (ability.callback && typeof ability.callback !== "function") {
      throw new Error(
        (0, import_i18n.sprintf)(
          'Ability "%s" has an invalid callback. Callback must be a function',
          ability.name
        )
      );
    }
    const existingAbility = select.getAbility(ability.name);
    if (existingAbility) {
      throw new Error(
        (0, import_i18n.sprintf)('Ability "%s" is already registered', ability.name)
      );
    }
    const annotations = filterAnnotations(ability.meta?.annotations, [
      "readonly",
      "destructive",
      "idempotent",
      "serverRegistered",
      "clientRegistered"
    ]);
    if (!annotations.serverRegistered) {
      annotations.clientRegistered = true;
    }
    const meta = {
      ...ability.meta || {},
      annotations
    };
    dispatch({
      type: import_constants.REGISTER_ABILITY,
      ability: {
        ...ability,
        meta
      }
    });
  };
}
function unregisterAbility(name) {
  return {
    type: import_constants.UNREGISTER_ABILITY,
    name
  };
}
function registerAbilityCategory(slug, args) {
  return ({ select, dispatch }) => {
    if (!slug) {
      throw new Error("Category slug is required");
    }
    if (!import_constants.CATEGORY_SLUG_PATTERN.test(slug)) {
      throw new Error(
        "Category slug must contain only lowercase alphanumeric characters and dashes."
      );
    }
    const existingCategory = select.getAbilityCategory(slug);
    if (existingCategory) {
      throw new Error(
        (0, import_i18n.sprintf)('Category "%s" is already registered.', slug)
      );
    }
    if (!args.label || typeof args.label !== "string") {
      throw new Error(
        "The category properties must contain a `label` string."
      );
    }
    if (!args.description || typeof args.description !== "string") {
      throw new Error(
        "The category properties must contain a `description` string."
      );
    }
    if (args.meta !== void 0 && (typeof args.meta !== "object" || Array.isArray(args.meta))) {
      throw new Error(
        "The category properties should provide a valid `meta` object."
      );
    }
    const annotations = filterAnnotations(args.meta?.annotations, [
      "serverRegistered",
      "clientRegistered"
    ]);
    if (!annotations.serverRegistered) {
      annotations.clientRegistered = true;
    }
    const meta = {
      ...args.meta || {},
      annotations
    };
    const category = {
      slug,
      label: args.label,
      description: args.description,
      meta
    };
    dispatch({
      type: import_constants.REGISTER_ABILITY_CATEGORY,
      category
    });
  };
}
function unregisterAbilityCategory(slug) {
  return {
    type: import_constants.UNREGISTER_ABILITY_CATEGORY,
    slug
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerAbility,
  registerAbilityCategory,
  unregisterAbility,
  unregisterAbilityCategory
});
//# sourceMappingURL=actions.cjs.map
