// packages/edit-site/src/components/page-patterns/search-items.js
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { unlock } from "../../lock-unlock.mjs";
import {
  TEMPLATE_PART_ALL_AREAS_CATEGORY,
  PATTERN_DEFAULT_CATEGORY,
  PATTERN_USER_CATEGORY,
  PATTERN_TYPES,
  TEMPLATE_PART_POST_TYPE
} from "../../utils/constants.mjs";
var { extractWords, getNormalizedSearchTerms, normalizeString } = unlock(
  blockEditorPrivateApis
);
var defaultGetName = (item) => {
  if (item.type === PATTERN_TYPES.user) {
    return item.slug;
  }
  if (item.type === TEMPLATE_PART_POST_TYPE) {
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
  if (item.type === PATTERN_TYPES.user) {
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
  const onlyFilterByCategory = config.categoryId !== PATTERN_DEFAULT_CATEGORY && !normalizedSearchTerms.length;
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
  let rank = categoryId === PATTERN_DEFAULT_CATEGORY || categoryId === TEMPLATE_PART_ALL_AREAS_CATEGORY || categoryId === PATTERN_USER_CATEGORY && item.type === PATTERN_TYPES.user || hasCategory(item, categoryId) ? 1 : 0;
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
export {
  defaultGetTitle,
  searchItems
};
//# sourceMappingURL=search-items.mjs.map
