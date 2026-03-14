"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/utils/search-templates.js
var search_templates_exports = {};
__export(search_templates_exports, {
  searchTemplates: () => searchTemplates
});
module.exports = __toCommonJS(search_templates_exports);
var import_remove_accents = __toESM(require("remove-accents"));
function normalizeSearchInput(input = "") {
  input = (0, import_remove_accents.default)(input);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  searchTemplates
});
//# sourceMappingURL=search-templates.cjs.map
