// packages/editor/src/utils/search-templates.js
import removeAccents from "remove-accents";
function normalizeSearchInput(input = "") {
  input = removeAccents(input);
  input = input.trim().toLowerCase();
  return input;
}
function getTemplateSearchRank(template, searchValue) {
  const normalizedSearchValue = normalizeSearchInput(searchValue);
  const normalizedTitle = normalizeSearchInput(template.title);
  let rank = 0;
  if (normalizedSearchValue === normalizedTitle) {
    rank += 30;
  } else if (normalizedTitle.startsWith(normalizedSearchValue)) {
    rank += 20;
  } else {
    const searchTerms = normalizedSearchValue.split(" ");
    const hasMatchedTerms = searchTerms.every(
      (searchTerm) => normalizedTitle.includes(searchTerm)
    );
    if (hasMatchedTerms) {
      rank += 10;
    }
  }
  return rank;
}
function searchTemplates(templates = [], searchValue = "") {
  if (!searchValue) {
    return templates;
  }
  const rankedTemplates = templates.map((template) => {
    return [template, getTemplateSearchRank(template, searchValue)];
  }).filter(([, rank]) => rank > 0);
  rankedTemplates.sort(([, rank1], [, rank2]) => rank2 - rank1);
  return rankedTemplates.map(([template]) => template);
}
export {
  searchTemplates
};
//# sourceMappingURL=search-templates.mjs.map
