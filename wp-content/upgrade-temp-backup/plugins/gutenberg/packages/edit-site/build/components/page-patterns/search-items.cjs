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

// packages/edit-site/src/components/page-patterns/search-items.js
var search_items_exports = {};
__export(search_items_exports, {
  defaultGetTitle: () => defaultGetTitle,
  searchItems: () => searchItems
});
module.exports = __toCommonJS(search_items_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_constants = require("../../utils/constants.cjs");
var { extractWords, getNormalizedSearchTerms, normalizeString } = (0, import_lock_unlock.unlock)(
  import_block_editor.privateApis
);
var defaultGetName = (item) => {
  if (item.type === import_constants.PATTERN_TYPES.user) {
    return item.slug;
  }
  if (item.type === import_constants.TEMPLATE_PART_POST_TYPE) {
    return "";
  }
  return item.name || "";
};
var defaultGetTitle = (item) => {
  if (typeof item.title === "string") {
    return item.title;
  }
  if (item.title && item.title.rendered) {
    return item.title.rendered;
  }
  if (item.title && item.title.raw) {
    return item.title.raw;
  }
  return "";
};
var defaultGetDescription = (item) => {
  if (item.type === import_constants.PATTERN_TYPES.user) {
    return item.excerpt.raw;
  }
  return item.description || "";
};
var defaultGetKeywords = (item) => item.keywords || [];
var defaultHasCategory = () => false;
var removeMatchingTerms = (unmatchedTerms, unprocessedTerms) => {
  return unmatchedTerms.filter(
    (term) => !getNormalizedSearchTerms(unprocessedTerms).some(
      (unprocessedTerm) => unprocessedTerm.includes(term)
    )
  );
};
var searchItems = (items = [], searchInput = "", config = {}) => {
  const normalizedSearchTerms = getNormalizedSearchTerms(searchInput);
  const onlyFilterByCategory = config.categoryId !== import_constants.PATTERN_DEFAULT_CATEGORY && !normalizedSearchTerms.length;
  const searchRankConfig = { ...config, onlyFilterByCategory };
  const threshold = onlyFilterByCategory ? 0 : 1;
  const rankedItems = items.map((item) => {
    return [
      item,
      getItemSearchRank(item, searchInput, searchRankConfig)
    ];
  }).filter(([, rank]) => rank > threshold);
  if (normalizedSearchTerms.length === 0) {
    return rankedItems.map(([item]) => item);
  }
  rankedItems.sort(([, rank1], [, rank2]) => rank2 - rank1);
  return rankedItems.map(([item]) => item);
};
function getItemSearchRank(item, searchTerm, config) {
  const {
    categoryId,
    getName = defaultGetName,
    getTitle = defaultGetTitle,
    getDescription = defaultGetDescription,
    getKeywords = defaultGetKeywords,
    hasCategory = defaultHasCategory,
    onlyFilterByCategory
  } = config;
  let rank = categoryId === import_constants.PATTERN_DEFAULT_CATEGORY || categoryId === import_constants.TEMPLATE_PART_ALL_AREAS_CATEGORY || categoryId === import_constants.PATTERN_USER_CATEGORY && item.type === import_constants.PATTERN_TYPES.user || hasCategory(item, categoryId) ? 1 : 0;
  if (!rank || onlyFilterByCategory) {
    return rank;
  }
  const name = getName(item);
  const title = getTitle(item);
  const description = getDescription(item);
  const keywords = getKeywords(item);
  const normalizedSearchInput = normalizeString(searchTerm);
  const normalizedTitle = normalizeString(title);
  if (normalizedSearchInput === normalizedTitle) {
    rank += 30;
  } else if (normalizedTitle.startsWith(normalizedSearchInput)) {
    rank += 20;
  } else {
    const terms = [name, title, description, ...keywords].join(" ");
    const normalizedSearchTerms = extractWords(normalizedSearchInput);
    const unmatchedTerms = removeMatchingTerms(
      normalizedSearchTerms,
      terms
    );
    if (unmatchedTerms.length === 0) {
      rank += 10;
    }
  }
  return rank;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultGetTitle,
  searchItems
});
//# sourceMappingURL=search-items.cjs.map
