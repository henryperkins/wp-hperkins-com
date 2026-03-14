// packages/block-library/src/query/edit/inspector-controls/taxonomy-controls.js
import {
  FormTokenField,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useState, useEffect, Fragment } from "@wordpress/element";
import { useDebounce } from "@wordpress/compose";
import { decodeEntities } from "@wordpress/html-entities";
import { sprintf, __ } from "@wordpress/i18n";
import { useTaxonomies } from "../../utils.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
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
  const taxonomies = useTaxonomies(postType);
  if (!taxonomies?.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(VStack, { spacing: 4, children: taxonomies.map((taxonomy) => {
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
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        TaxonomyItem,
        {
          taxonomy,
          termIds: includeTermIds,
          oppositeTermIds: excludeTermIds,
          onChange: (value) => onChangeTaxQuery(value, "include"),
          label: taxonomy.name
        }
      ),
      /* @__PURE__ */ jsx(
        TaxonomyItem,
        {
          taxonomy,
          termIds: excludeTermIds,
          oppositeTermIds: includeTermIds,
          onChange: (value) => onChangeTaxQuery(value, "exclude"),
          label: (
            /* translators: %s: taxonomy name */
            sprintf(__("Exclude: %s"), taxonomy.name)
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
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(EMPTY_ARRAY);
  const [suggestions, setSuggestions] = useState(EMPTY_ARRAY);
  const debouncedSearch = useDebounce(setSearch, 250);
  const { searchResults, searchHasResolved } = useSelect(
    (select) => {
      if (!search) {
        return { searchResults: EMPTY_ARRAY, searchHasResolved: true };
      }
      const { getEntityRecords, hasFinishedResolution } = select(coreStore);
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
  const existingTerms = useSelect(
    (select) => {
      if (!termIds?.length) {
        return EMPTY_ARRAY;
      }
      const { getEntityRecords } = select(coreStore);
      return getEntityRecords("taxonomy", taxonomy.slug, {
        ...BASE_QUERY,
        include: termIds,
        per_page: termIds.length
      });
    },
    [taxonomy.slug, termIds]
  );
  useEffect(() => {
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
  useEffect(() => {
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
  return /* @__PURE__ */ jsx("div", { className: "block-library-query-inspector__taxonomy-control", children: /* @__PURE__ */ jsx(
    FormTokenField,
    {
      label,
      value,
      onInputChange: debouncedSearch,
      suggestions,
      displayTransform: decodeEntities,
      onChange: onTermsChange,
      __experimentalShowHowTo: false,
      __next40pxDefaultSize: true
    }
  ) });
}
export {
  TaxonomyControls
};
//# sourceMappingURL=taxonomy-controls.mjs.map
