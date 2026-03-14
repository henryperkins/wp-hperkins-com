// packages/core-abilities/src/index.ts
import { registerAbility, registerAbilityCategory } from "@wordpress/abilities";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
var API_BASE = "/wp-abilities/v1";
var ABILITIES_ENDPOINT = `${API_BASE}/abilities`;
var CATEGORIES_ENDPOINT = `${API_BASE}/categories`;
function createServerCallback(ability) {
  return async (input) => {
    let method = "POST";
    if (!!ability.meta?.annotations?.readonly) {
      method = "GET";
    } else if (!!ability.meta?.annotations?.destructive && !!ability.meta?.annotations?.idempotent) {
      method = "DELETE";
    }
    let path = `${ABILITIES_ENDPOINT}/${ability.name}/run`;
    const options = {
      method
    };
    if (["GET", "DELETE"].includes(method) && input !== null && input !== void 0) {
      path = addQueryArgs(path, { input });
    } else if (method === "POST" && input !== null && input !== void 0) {
      options.data = { input };
    }
    return apiFetch({
      path,
      ...options
    });
  };
}
async function initializeCategories() {
  try {
    const categories = await apiFetch({
      path: addQueryArgs(CATEGORIES_ENDPOINT, {
        per_page: -1,
        context: "edit"
      })
    });
    if (categories && Array.isArray(categories)) {
      for (const category of categories) {
        registerAbilityCategory(category.slug, {
          label: category.label,
          description: category.description,
          meta: {
            annotations: { serverRegistered: true }
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch ability categories:", error);
  }
}
async function initializeAbilities() {
  try {
    const abilities = await apiFetch({
      path: addQueryArgs(ABILITIES_ENDPOINT, {
        per_page: -1,
        context: "edit"
      })
    });
    if (abilities && Array.isArray(abilities)) {
      for (const ability of abilities) {
        registerAbility({
          ...ability,
          callback: createServerCallback(ability),
          meta: {
            annotations: {
              ...ability.meta?.annotations,
              serverRegistered: true
            }
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch abilities:", error);
  }
}
async function initialize() {
  await initializeCategories();
  await initializeAbilities();
}
initialize();
//# sourceMappingURL=index.mjs.map
