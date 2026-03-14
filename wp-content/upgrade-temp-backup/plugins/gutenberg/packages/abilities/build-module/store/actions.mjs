// packages/abilities/src/store/actions.ts
import { sprintf } from "@wordpress/i18n";
import {
  REGISTER_ABILITY,
  UNREGISTER_ABILITY,
  REGISTER_ABILITY_CATEGORY,
  UNREGISTER_ABILITY_CATEGORY,
  ABILITY_NAME_PATTERN,
  CATEGORY_SLUG_PATTERN
} from "./constants.mjs";
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
    if (!ABILITY_NAME_PATTERN.test(ability.name)) {
      throw new Error(
        'Ability name must be a string containing a namespace prefix with 2-4 segments, e.g. "my-plugin/my-ability" or "core/posts/find". It can only contain lowercase alphanumeric characters, dashes and the forward slash.'
      );
    }
    if (!ability.label) {
      throw new Error(
        sprintf('Ability "%s" must have a label', ability.name)
      );
    }
    if (!ability.description) {
      throw new Error(
        sprintf('Ability "%s" must have a description', ability.name)
      );
    }
    if (!ability.category) {
      throw new Error(
        sprintf('Ability "%s" must have a category', ability.name)
      );
    }
    if (!CATEGORY_SLUG_PATTERN.test(ability.category)) {
      throw new Error(
        sprintf(
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
        sprintf(
          'Ability "%1$s" references non-existent category "%2$s". Please register the category first.',
          ability.name,
          ability.category
        )
      );
    }
    if (ability.callback && typeof ability.callback !== "function") {
      throw new Error(
        sprintf(
          'Ability "%s" has an invalid callback. Callback must be a function',
          ability.name
        )
      );
    }
    const existingAbility = select.getAbility(ability.name);
    if (existingAbility) {
      throw new Error(
        sprintf('Ability "%s" is already registered', ability.name)
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
      type: REGISTER_ABILITY,
      ability: {
        ...ability,
        meta
      }
    });
  };
}
function unregisterAbility(name) {
  return {
    type: UNREGISTER_ABILITY,
    name
  };
}
function registerAbilityCategory(slug, args) {
  return ({ select, dispatch }) => {
    if (!slug) {
      throw new Error("Category slug is required");
    }
    if (!CATEGORY_SLUG_PATTERN.test(slug)) {
      throw new Error(
        "Category slug must contain only lowercase alphanumeric characters and dashes."
      );
    }
    const existingCategory = select.getAbilityCategory(slug);
    if (existingCategory) {
      throw new Error(
        sprintf('Category "%s" is already registered.', slug)
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
      type: REGISTER_ABILITY_CATEGORY,
      category
    });
  };
}
function unregisterAbilityCategory(slug) {
  return {
    type: UNREGISTER_ABILITY_CATEGORY,
    slug
  };
}
export {
  registerAbility,
  registerAbilityCategory,
  unregisterAbility,
  unregisterAbilityCategory
};
//# sourceMappingURL=actions.mjs.map
