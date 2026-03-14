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

// packages/edit-site/src/components/page-patterns/use-patterns.js
var use_patterns_exports = {};
__export(use_patterns_exports, {
  default: () => use_patterns_default,
  useAugmentPatternsWithPermissions: () => useAugmentPatternsWithPermissions,
  usePatterns: () => usePatterns
});
module.exports = __toCommonJS(use_patterns_exports);
var import_blocks = require("@wordpress/blocks");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_utils = require("./utils.cjs");
var import_constants = require("../../utils/constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_search_items = require("./search-items.cjs");
var import_store = require("../../store/index.cjs");
var EMPTY_PATTERN_LIST = [];
var selectTemplateParts = (0, import_data.createSelector)(
  (select, categoryId, search = "") => {
    const {
      getEntityRecords,
      getCurrentTheme,
      isResolving: isResolvingSelector
    } = select(import_core_data.store);
    const query = { per_page: -1 };
    const templateParts = getEntityRecords("postType", import_constants.TEMPLATE_PART_POST_TYPE, query) ?? EMPTY_PATTERN_LIST;
    const knownAreas = getCurrentTheme()?.default_template_part_areas || [];
    const templatePartAreas = knownAreas.map((area) => area.area);
    const templatePartHasCategory = (item, category) => {
      if (category !== import_constants.TEMPLATE_PART_AREA_DEFAULT_CATEGORY) {
        return item.area === category;
      }
      return item.area === category || !templatePartAreas.includes(item.area);
    };
    const isResolving = isResolvingSelector("getEntityRecords", [
      "postType",
      import_constants.TEMPLATE_PART_POST_TYPE,
      query
    ]);
    const patterns = (0, import_search_items.searchItems)(templateParts, search, {
      categoryId,
      hasCategory: templatePartHasCategory
    });
    return { patterns, isResolving };
  },
  (select) => [
    select(import_core_data.store).getEntityRecords(
      "postType",
      import_constants.TEMPLATE_PART_POST_TYPE,
      {
        per_page: -1
      }
    ),
    select(import_core_data.store).isResolving("getEntityRecords", [
      "postType",
      import_constants.TEMPLATE_PART_POST_TYPE,
      { per_page: -1 }
    ]),
    select(import_core_data.store).getCurrentTheme()?.default_template_part_areas
  ]
);
var selectThemePatterns = (0, import_data.createSelector)(
  (select) => {
    const { getSettings } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const { isResolving: isResolvingSelector } = select(import_core_data.store);
    const settings = getSettings();
    const blockPatterns = settings.__experimentalAdditionalBlockPatterns ?? settings.__experimentalBlockPatterns;
    const restBlockPatterns = select(import_core_data.store).getBlockPatterns();
    const patterns = [
      ...blockPatterns || [],
      ...restBlockPatterns || []
    ].filter(
      (pattern) => !import_constants.EXCLUDED_PATTERN_SOURCES.includes(pattern.source)
    ).filter(import_utils.filterOutDuplicatesByName).filter((pattern) => pattern.inserter !== false).map((pattern) => ({
      ...pattern,
      keywords: pattern.keywords || [],
      type: import_constants.PATTERN_TYPES.theme,
      blocks: (0, import_blocks.parse)(pattern.content, {
        __unstableSkipMigrationLogs: true
      })
    }));
    return {
      patterns,
      isResolving: isResolvingSelector("getBlockPatterns")
    };
  },
  (select) => [
    select(import_core_data.store).getBlockPatterns(),
    select(import_core_data.store).isResolving("getBlockPatterns"),
    (0, import_lock_unlock.unlock)(select(import_store.store)).getSettings()
  ]
);
var selectPatterns = (0, import_data.createSelector)(
  (select, categoryId, syncStatus, search = "") => {
    const {
      patterns: themePatterns,
      isResolving: isResolvingThemePatterns
    } = selectThemePatterns(select);
    const {
      patterns: userPatterns,
      isResolving: isResolvingUserPatterns,
      categories: userPatternCategories
    } = selectUserPatterns(select);
    let patterns = [
      ...themePatterns || [],
      ...userPatterns || []
    ];
    if (syncStatus) {
      patterns = patterns.filter((pattern) => {
        return pattern.type === import_constants.PATTERN_TYPES.user ? (pattern.wp_pattern_sync_status || import_constants.PATTERN_SYNC_TYPES.full) === syncStatus : syncStatus === import_constants.PATTERN_SYNC_TYPES.unsynced;
      });
    }
    if (categoryId) {
      patterns = (0, import_search_items.searchItems)(patterns, search, {
        categoryId,
        hasCategory: (item, currentCategory) => {
          if (item.type === import_constants.PATTERN_TYPES.user) {
            return item.wp_pattern_category?.some(
              (catId) => userPatternCategories.find(
                (cat) => cat.id === catId
              )?.slug === currentCategory
            );
          }
          return item.categories?.includes(currentCategory);
        }
      });
    } else {
      patterns = (0, import_search_items.searchItems)(patterns, search, {
        hasCategory: (item) => {
          if (item.type === import_constants.PATTERN_TYPES.user) {
            return userPatternCategories?.length && (!item.wp_pattern_category?.length || !item.wp_pattern_category?.some(
              (catId) => userPatternCategories.find(
                (cat) => cat.id === catId
              )
            ));
          }
          return !item.hasOwnProperty("categories");
        }
      });
    }
    return {
      patterns,
      isResolving: isResolvingThemePatterns || isResolvingUserPatterns
    };
  },
  (select) => [
    selectThemePatterns(select),
    selectUserPatterns(select)
  ]
);
var selectUserPatterns = (0, import_data.createSelector)(
  (select, syncStatus, search = "") => {
    const {
      getEntityRecords,
      isResolving: isResolvingSelector,
      getUserPatternCategories
    } = select(import_core_data.store);
    const query = { per_page: -1 };
    const patternPosts = getEntityRecords(
      "postType",
      import_constants.PATTERN_TYPES.user,
      query
    );
    const userPatternCategories = getUserPatternCategories();
    const categories = /* @__PURE__ */ new Map();
    userPatternCategories.forEach(
      (userCategory) => categories.set(userCategory.id, userCategory)
    );
    let patterns = patternPosts ?? EMPTY_PATTERN_LIST;
    const isResolving = isResolvingSelector("getEntityRecords", [
      "postType",
      import_constants.PATTERN_TYPES.user,
      query
    ]);
    if (syncStatus) {
      patterns = patterns.filter(
        (pattern) => pattern.wp_pattern_sync_status || import_constants.PATTERN_SYNC_TYPES.full === syncStatus
      );
    }
    patterns = (0, import_search_items.searchItems)(patterns, search, {
      // We exit user pattern retrieval early if we aren't in the
      // catch-all category for user created patterns, so it has
      // to be in the category.
      hasCategory: () => true
    });
    return {
      patterns,
      isResolving,
      categories: userPatternCategories
    };
  },
  (select) => [
    select(import_core_data.store).getEntityRecords("postType", import_constants.PATTERN_TYPES.user, {
      per_page: -1
    }),
    select(import_core_data.store).isResolving("getEntityRecords", [
      "postType",
      import_constants.PATTERN_TYPES.user,
      { per_page: -1 }
    ]),
    select(import_core_data.store).getUserPatternCategories()
  ]
);
function useAugmentPatternsWithPermissions(patterns) {
  const idsAndTypes = (0, import_element.useMemo)(
    () => patterns?.filter((record) => record.type !== import_constants.PATTERN_TYPES.theme).map((record) => [record.type, record.id]) ?? [],
    [patterns]
  );
  const permissions = (0, import_data.useSelect)(
    (select) => {
      const { getEntityRecordPermissions } = (0, import_lock_unlock.unlock)(
        select(import_core_data.store)
      );
      return idsAndTypes.reduce((acc, [type, id]) => {
        acc[id] = getEntityRecordPermissions("postType", type, id);
        return acc;
      }, {});
    },
    [idsAndTypes]
  );
  return (0, import_element.useMemo)(
    () => patterns?.map((record) => ({
      ...record,
      permissions: permissions?.[record.id] ?? {}
    })) ?? [],
    [patterns, permissions]
  );
}
var usePatterns = (postType, categoryId, { search = "", syncStatus } = {}) => {
  return (0, import_data.useSelect)(
    (select) => {
      if (postType === import_constants.TEMPLATE_PART_POST_TYPE) {
        return selectTemplateParts(select, categoryId, search);
      } else if (postType === import_constants.PATTERN_TYPES.user && !!categoryId) {
        const appliedCategory = categoryId === "uncategorized" ? "" : categoryId;
        return selectPatterns(
          select,
          appliedCategory,
          syncStatus,
          search
        );
      } else if (postType === import_constants.PATTERN_TYPES.user) {
        return selectUserPatterns(select, syncStatus, search);
      }
      return {
        patterns: EMPTY_PATTERN_LIST,
        isResolving: false
      };
    },
    [categoryId, postType, search, syncStatus]
  );
};
var use_patterns_default = usePatterns;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAugmentPatternsWithPermissions,
  usePatterns
});
//# sourceMappingURL=use-patterns.cjs.map
