// packages/editor/src/components/post-taxonomies/flat-term-selector.js
import { __, _x, sprintf } from "@wordpress/i18n";
import { useEffect, useMemo, useState } from "@wordpress/element";
import {
  FormTokenField,
  withFilters,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { useDebounce } from "@wordpress/compose";
import { speak } from "@wordpress/a11y";
import { store as noticesStore } from "@wordpress/notices";
import { store as editorStore } from "../../store/index.mjs";
import { unescapeString, unescapeTerm } from "../../utils/terms.mjs";
import MostUsedTerms from "./most-used-terms.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var EMPTY_ARRAY = [];
var MAX_TERMS_SUGGESTIONS = 100;
var DEFAULT_QUERY = {
  per_page: MAX_TERMS_SUGGESTIONS,
  _fields: "id,name",
  context: "view"
};
var isSameTermName = (termA, termB) => unescapeString(termA).toLowerCase() === unescapeString(termB).toLowerCase();
var termNamesToIds = (names, terms) => {
  return names.map(
    (termName) => terms.find((term) => isSameTermName(term.name, termName))?.id
  ).filter((id) => id !== void 0);
};
function FlatTermSelector({ slug }) {
  const [values, setValues] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(setSearch, 500);
  const {
    terms,
    termIds,
    taxonomy,
    hasAssignAction,
    hasCreateAction,
    hasResolvedTerms
  } = useSelect(
    (select) => {
      const { getCurrentPost, getEditedPostAttribute } = select(editorStore);
      const { getEntityRecords, getEntityRecord, hasFinishedResolution } = select(coreStore);
      const post = getCurrentPost();
      const _taxonomy = getEntityRecord("root", "taxonomy", slug);
      const _termIds = _taxonomy ? getEditedPostAttribute(_taxonomy.rest_base) : EMPTY_ARRAY;
      const query = {
        ...DEFAULT_QUERY,
        include: _termIds?.join(","),
        per_page: -1
      };
      return {
        hasCreateAction: _taxonomy ? post._links?.["wp:action-create-" + _taxonomy.rest_base] ?? false : false,
        hasAssignAction: _taxonomy ? post._links?.["wp:action-assign-" + _taxonomy.rest_base] ?? false : false,
        taxonomy: _taxonomy,
        termIds: _termIds,
        terms: _termIds?.length ? getEntityRecords("taxonomy", slug, query) : EMPTY_ARRAY,
        hasResolvedTerms: hasFinishedResolution("getEntityRecords", [
          "taxonomy",
          slug,
          query
        ])
      };
    },
    [slug]
  );
  const { searchResults } = useSelect(
    (select) => {
      const { getEntityRecords } = select(coreStore);
      return {
        searchResults: !!search ? getEntityRecords("taxonomy", slug, {
          ...DEFAULT_QUERY,
          search
        }) : EMPTY_ARRAY
      };
    },
    [search, slug]
  );
  useEffect(() => {
    if (hasResolvedTerms) {
      const newValues = (terms ?? []).map(
        (term) => unescapeString(term.name)
      );
      setValues(newValues);
    }
  }, [terms, hasResolvedTerms]);
  const suggestions = useMemo(() => {
    return (searchResults ?? []).map(
      (term) => unescapeString(term.name)
    );
  }, [searchResults]);
  const { editPost } = useDispatch(editorStore);
  const { saveEntityRecord } = useDispatch(coreStore);
  const { createErrorNotice } = useDispatch(noticesStore);
  if (!hasAssignAction) {
    return null;
  }
  async function findOrCreateTerm(term) {
    try {
      const newTerm = await saveEntityRecord("taxonomy", slug, term, {
        throwOnError: true
      });
      return unescapeTerm(newTerm);
    } catch (error) {
      if (error.code !== "term_exists") {
        throw error;
      }
      return {
        id: error.data.term_id,
        name: term.name
      };
    }
  }
  function onUpdateTerms(newTermIds) {
    editPost({ [taxonomy.rest_base]: newTermIds });
  }
  function onChange(termNames) {
    const availableTerms = [
      ...terms ?? [],
      ...searchResults ?? []
    ];
    const uniqueTerms = termNames.reduce((acc, name) => {
      if (!acc.some((n) => n.toLowerCase() === name.toLowerCase())) {
        acc.push(name);
      }
      return acc;
    }, []);
    const newTermNames = uniqueTerms.filter(
      (termName) => !availableTerms.find(
        (term) => isSameTermName(term.name, termName)
      )
    );
    setValues(uniqueTerms);
    if (newTermNames.length === 0) {
      onUpdateTerms(termNamesToIds(uniqueTerms, availableTerms));
      return;
    }
    if (!hasCreateAction) {
      return;
    }
    Promise.all(
      newTermNames.map(
        (termName) => findOrCreateTerm({ name: termName })
      )
    ).then((newTerms) => {
      const newAvailableTerms = availableTerms.concat(newTerms);
      onUpdateTerms(
        termNamesToIds(uniqueTerms, newAvailableTerms)
      );
    }).catch((error) => {
      createErrorNotice(error.message, {
        type: "snackbar"
      });
      onUpdateTerms(termNamesToIds(uniqueTerms, availableTerms));
    });
  }
  function appendTerm(newTerm) {
    if (termIds.includes(newTerm.id)) {
      return;
    }
    const newTermIds = [...termIds, newTerm.id];
    const defaultName = slug === "post_tag" ? __("Tag") : __("Term");
    const termAddedMessage = sprintf(
      /* translators: %s: term name. */
      _x("%s added", "term"),
      taxonomy?.labels?.singular_name ?? defaultName
    );
    speak(termAddedMessage, "assertive");
    onUpdateTerms(newTermIds);
  }
  const newTermLabel = taxonomy?.labels?.add_new_item ?? (slug === "post_tag" ? __("Add Tag") : __("Add Term"));
  const singularName = taxonomy?.labels?.singular_name ?? (slug === "post_tag" ? __("Tag") : __("Term"));
  const termAddedLabel = sprintf(
    /* translators: %s: term name. */
    _x("%s added", "term"),
    singularName
  );
  const termRemovedLabel = sprintf(
    /* translators: %s: term name. */
    _x("%s removed", "term"),
    singularName
  );
  const removeTermLabel = sprintf(
    /* translators: %s: term name. */
    _x("Remove %s", "term"),
    singularName
  );
  return /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
    /* @__PURE__ */ jsx(
      FormTokenField,
      {
        __next40pxDefaultSize: true,
        value: values,
        suggestions,
        onChange,
        onInputChange: debouncedSearch,
        maxSuggestions: MAX_TERMS_SUGGESTIONS,
        label: newTermLabel,
        messages: {
          added: termAddedLabel,
          removed: termRemovedLabel,
          remove: removeTermLabel
        }
      }
    ),
    /* @__PURE__ */ jsx(MostUsedTerms, { taxonomy, onSelect: appendTerm })
  ] });
}
var flat_term_selector_default = withFilters("editor.PostTaxonomyType")(FlatTermSelector);
export {
  FlatTermSelector,
  flat_term_selector_default as default
};
//# sourceMappingURL=flat-term-selector.mjs.map
