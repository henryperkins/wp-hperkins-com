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

// packages/block-library/src/query/edit/inspector-controls/taxonomy-controls.js
var taxonomy_controls_exports = {};
__export(taxonomy_controls_exports, {
  TaxonomyControls: () => TaxonomyControls
});
module.exports = __toCommonJS(taxonomy_controls_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_html_entities = require("@wordpress/html-entities");
var import_i18n = require("@wordpress/i18n");
var import_utils = require("../../utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_ARRAY = [];
var BASE_QUERY = {
  order: "asc",
  _fields: "id,name",
  context: "view"
};
var getTermIdByTermValue = (terms, termValue) => {
  const termId = termValue?.id || terms?.find((term) => term.name === termValue)?.id;
  if (termId) {
    return termId;
  }
  const termValueLower = termValue.toLocaleLowerCase();
  return terms?.find(
    (term) => term.name.toLocaleLowerCase() === termValueLower
  )?.id;
};
function TaxonomyControls({ onChange, query }) {
  const { postType, taxQuery } = query;
  const taxonomies = (0, import_utils.useTaxonomies)(postType);
  if (!taxonomies?.length) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 4, children: taxonomies.map((taxonomy) => {
    const includeTermIds = taxQuery?.include?.[taxonomy.slug] || [];
    const excludeTermIds = taxQuery?.exclude?.[taxonomy.slug] || [];
    const onChangeTaxQuery = (newTermIds, key) => {
      const newPartialTaxQuery = {
        ...taxQuery?.[key],
        [taxonomy.slug]: newTermIds
      };
      if (!newTermIds.length) {
        delete newPartialTaxQuery[taxonomy.slug];
      }
      const newTaxQuery = {
        ...taxQuery,
        [key]: !!Object.keys(newPartialTaxQuery).length ? newPartialTaxQuery : void 0
      };
      onChange({
        // Clean up `taxQuery` if all filters are removed.
        taxQuery: Object.values(newTaxQuery).every(
          (value) => !value
        ) ? void 0 : newTaxQuery
      });
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_element.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TaxonomyItem,
        {
          taxonomy,
          termIds: includeTermIds,
          oppositeTermIds: excludeTermIds,
          onChange: (value) => onChangeTaxQuery(value, "include"),
          label: taxonomy.name
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        TaxonomyItem,
        {
          taxonomy,
          termIds: excludeTermIds,
          oppositeTermIds: includeTermIds,
          onChange: (value) => onChangeTaxQuery(value, "exclude"),
          label: (
            /* translators: %s: taxonomy name */
            (0, import_i18n.sprintf)((0, import_i18n.__)("Exclude: %s"), taxonomy.name)
          )
        }
      )
    ] }, taxonomy.slug);
  }) });
}
function TaxonomyItem({
  taxonomy,
  termIds,
  oppositeTermIds,
  onChange,
  label
}) {
  const [search, setSearch] = (0, import_element.useState)("");
  const [value, setValue] = (0, import_element.useState)(EMPTY_ARRAY);
  const [suggestions, setSuggestions] = (0, import_element.useState)(EMPTY_ARRAY);
  const debouncedSearch = (0, import_compose.useDebounce)(setSearch, 250);
  const { searchResults, searchHasResolved } = (0, import_data.useSelect)(
    (select) => {
      if (!search) {
        return { searchResults: EMPTY_ARRAY, searchHasResolved: true };
      }
      const { getEntityRecords, hasFinishedResolution } = select(import_core_data.store);
      const combinedExclude = [...termIds, ...oppositeTermIds];
      const selectorArgs = [
        "taxonomy",
        taxonomy.slug,
        {
          ...BASE_QUERY,
          search,
          orderby: "name",
          exclude: combinedExclude,
          per_page: 20
        }
      ];
      return {
        searchResults: getEntityRecords(...selectorArgs),
        searchHasResolved: hasFinishedResolution(
          "getEntityRecords",
          selectorArgs
        )
      };
    },
    [search, taxonomy.slug, termIds, oppositeTermIds]
  );
  const existingTerms = (0, import_data.useSelect)(
    (select) => {
      if (!termIds?.length) {
        return EMPTY_ARRAY;
      }
      const { getEntityRecords } = select(import_core_data.store);
      return getEntityRecords("taxonomy", taxonomy.slug, {
        ...BASE_QUERY,
        include: termIds,
        per_page: termIds.length
      });
    },
    [taxonomy.slug, termIds]
  );
  (0, import_element.useEffect)(() => {
    if (!termIds?.length) {
      setValue(EMPTY_ARRAY);
    }
    if (!existingTerms?.length) {
      return;
    }
    const sanitizedValue = termIds.reduce((accumulator, id) => {
      const entity = existingTerms.find((term) => term.id === id);
      if (entity) {
        accumulator.push({
          id,
          value: entity.name
        });
      }
      return accumulator;
    }, []);
    setValue(sanitizedValue);
  }, [termIds, existingTerms]);
  (0, import_element.useEffect)(() => {
    if (!searchHasResolved) {
      return;
    }
    setSuggestions(searchResults.map((result) => result.name));
  }, [searchResults, searchHasResolved]);
  const onTermsChange = (newTermValues) => {
    const newTermIds = /* @__PURE__ */ new Set();
    for (const termValue of newTermValues) {
      const termId = getTermIdByTermValue(searchResults, termValue);
      if (termId) {
        newTermIds.add(termId);
      }
    }
    setSuggestions(EMPTY_ARRAY);
    onChange(Array.from(newTermIds));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-library-query-inspector__taxonomy-control", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.FormTokenField,
    {
      label,
      value,
      onInputChange: debouncedSearch,
      suggestions,
      displayTransform: import_html_entities.decodeEntities,
      onChange: onTermsChange,
      __experimentalShowHowTo: false,
      __next40pxDefaultSize: true
    }
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TaxonomyControls
});
//# sourceMappingURL=taxonomy-controls.cjs.map
