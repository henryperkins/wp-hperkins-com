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

// packages/editor/src/components/post-taxonomies/flat-term-selector.js
var flat_term_selector_exports = {};
__export(flat_term_selector_exports, {
  FlatTermSelector: () => FlatTermSelector,
  default: () => flat_term_selector_default
});
module.exports = __toCommonJS(flat_term_selector_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_compose = require("@wordpress/compose");
var import_a11y = require("@wordpress/a11y");
var import_notices = require("@wordpress/notices");
var import_store = require("../../store/index.cjs");
var import_terms = require("../../utils/terms.cjs");
var import_most_used_terms = __toESM(require("./most-used-terms.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_ARRAY = [];
var MAX_TERMS_SUGGESTIONS = 100;
var DEFAULT_QUERY = {
  per_page: MAX_TERMS_SUGGESTIONS,
  _fields: "id,name",
  context: "view"
};
var isSameTermName = (termA, termB) => (0, import_terms.unescapeString)(termA).toLowerCase() === (0, import_terms.unescapeString)(termB).toLowerCase();
var termNamesToIds = (names, terms) => {
  return names.map(
    (termName) => terms.find((term) => isSameTermName(term.name, termName))?.id
  ).filter((id) => id !== void 0);
};
function FlatTermSelector({ slug }) {
  const [values, setValues] = (0, import_element.useState)([]);
  const [search, setSearch] = (0, import_element.useState)("");
  const debouncedSearch = (0, import_compose.useDebounce)(setSearch, 500);
  const {
    terms,
    termIds,
    taxonomy,
    hasAssignAction,
    hasCreateAction,
    hasResolvedTerms
  } = (0, import_data.useSelect)(
    (select) => {
      const { getCurrentPost, getEditedPostAttribute } = select(import_store.store);
      const { getEntityRecords, getEntityRecord, hasFinishedResolution } = select(import_core_data.store);
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
  const { searchResults } = (0, import_data.useSelect)(
    (select) => {
      const { getEntityRecords } = select(import_core_data.store);
      return {
        searchResults: !!search ? getEntityRecords("taxonomy", slug, {
          ...DEFAULT_QUERY,
          search
        }) : EMPTY_ARRAY
      };
    },
    [search, slug]
  );
  (0, import_element.useEffect)(() => {
    if (hasResolvedTerms) {
      const newValues = (terms ?? []).map(
        (term) => (0, import_terms.unescapeString)(term.name)
      );
      setValues(newValues);
    }
  }, [terms, hasResolvedTerms]);
  const suggestions = (0, import_element.useMemo)(() => {
    return (searchResults ?? []).map(
      (term) => (0, import_terms.unescapeString)(term.name)
    );
  }, [searchResults]);
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  if (!hasAssignAction) {
    return null;
  }
  async function findOrCreateTerm(term) {
    try {
      const newTerm = await saveEntityRecord("taxonomy", slug, term, {
        throwOnError: true
      });
      return (0, import_terms.unescapeTerm)(newTerm);
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
    const defaultName = slug === "post_tag" ? (0, import_i18n.__)("Tag") : (0, import_i18n.__)("Term");
    const termAddedMessage = (0, import_i18n.sprintf)(
      /* translators: %s: term name. */
      (0, import_i18n._x)("%s added", "term"),
      taxonomy?.labels?.singular_name ?? defaultName
    );
    (0, import_a11y.speak)(termAddedMessage, "assertive");
    onUpdateTerms(newTermIds);
  }
  const newTermLabel = taxonomy?.labels?.add_new_item ?? (slug === "post_tag" ? (0, import_i18n.__)("Add Tag") : (0, import_i18n.__)("Add Term"));
  const singularName = taxonomy?.labels?.singular_name ?? (slug === "post_tag" ? (0, import_i18n.__)("Tag") : (0, import_i18n.__)("Term"));
  const termAddedLabel = (0, import_i18n.sprintf)(
    /* translators: %s: term name. */
    (0, import_i18n._x)("%s added", "term"),
    singularName
  );
  const termRemovedLabel = (0, import_i18n.sprintf)(
    /* translators: %s: term name. */
    (0, import_i18n._x)("%s removed", "term"),
    singularName
  );
  const removeTermLabel = (0, import_i18n.sprintf)(
    /* translators: %s: term name. */
    (0, import_i18n._x)("Remove %s", "term"),
    singularName
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.FormTokenField,
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
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_most_used_terms.default, { taxonomy, onSelect: appendTerm })
  ] });
}
var flat_term_selector_default = (0, import_components.withFilters)("editor.PostTaxonomyType")(FlatTermSelector);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FlatTermSelector
});
//# sourceMappingURL=flat-term-selector.cjs.map
