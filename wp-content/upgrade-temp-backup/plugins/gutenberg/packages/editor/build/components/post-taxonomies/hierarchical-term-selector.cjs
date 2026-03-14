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

// packages/editor/src/components/post-taxonomies/hierarchical-term-selector.js
var hierarchical_term_selector_exports = {};
__export(hierarchical_term_selector_exports, {
  HierarchicalTermSelector: () => HierarchicalTermSelector,
  default: () => hierarchical_term_selector_default,
  findTerm: () => findTerm,
  getFilterMatcher: () => getFilterMatcher,
  sortBySelected: () => sortBySelected
});
module.exports = __toCommonJS(hierarchical_term_selector_exports);
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_notices = require("@wordpress/notices");
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_compose = require("@wordpress/compose");
var import_core_data = require("@wordpress/core-data");
var import_a11y = require("@wordpress/a11y");
var import_html_entities = require("@wordpress/html-entities");
var import_terms = require("../../utils/terms.cjs");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { normalizeTextString } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var { RECEIVE_INTERMEDIATE_RESULTS } = (0, import_lock_unlock.unlock)(import_core_data.privateApis);
var DEFAULT_QUERY = {
  per_page: -1,
  orderby: "name",
  order: "asc",
  _fields: "id,name,parent",
  context: "view",
  [RECEIVE_INTERMEDIATE_RESULTS]: true
};
var MIN_TERMS_COUNT_FOR_FILTER = 8;
var EMPTY_ARRAY = [];
function sortBySelected(termsTree, terms) {
  const treeHasSelection = (termTree) => {
    if (terms.indexOf(termTree.id) !== -1) {
      return true;
    }
    if (void 0 === termTree.children) {
      return false;
    }
    return termTree.children.map(treeHasSelection).filter((child) => child).length > 0;
  };
  const termOrChildIsSelected = (termA, termB) => {
    const termASelected = treeHasSelection(termA);
    const termBSelected = treeHasSelection(termB);
    if (termASelected === termBSelected) {
      return 0;
    }
    if (termASelected && !termBSelected) {
      return -1;
    }
    if (!termASelected && termBSelected) {
      return 1;
    }
    return 0;
  };
  const newTermTree = [...termsTree];
  newTermTree.sort(termOrChildIsSelected);
  return newTermTree;
}
function findTerm(terms, parent, name) {
  return terms.find((term) => {
    return (!term.parent && !parent || parseInt(term.parent) === parseInt(parent)) && term.name.toLowerCase() === name.toLowerCase();
  });
}
function getFilterMatcher(filterValue) {
  const matchTermsForFilter = (originalTerm) => {
    if ("" === filterValue) {
      return originalTerm;
    }
    const term = { ...originalTerm };
    if (term.children.length > 0) {
      term.children = term.children.map(matchTermsForFilter).filter((child) => child);
    }
    if (-1 !== normalizeTextString(term.name).indexOf(
      normalizeTextString(filterValue)
    ) || term.children.length > 0) {
      return term;
    }
    return false;
  };
  return matchTermsForFilter;
}
function HierarchicalTermSelector({ slug }) {
  const [adding, setAdding] = (0, import_element.useState)(false);
  const [formName, setFormName] = (0, import_element.useState)("");
  const [formParent, setFormParent] = (0, import_element.useState)("");
  const [showForm, setShowForm] = (0, import_element.useState)(false);
  const [filterValue, setFilterValue] = (0, import_element.useState)("");
  const [filteredTermsTree, setFilteredTermsTree] = (0, import_element.useState)([]);
  const debouncedSpeak = (0, import_compose.useDebounce)(import_a11y.speak, 500);
  const {
    hasCreateAction,
    hasAssignAction,
    terms,
    loading,
    availableTerms,
    taxonomy
  } = (0, import_data.useSelect)(
    (select) => {
      const { getCurrentPost, getEditedPostAttribute } = select(import_store.store);
      const { getEntityRecord, getEntityRecords, isResolving } = select(import_core_data.store);
      const _taxonomy = getEntityRecord("root", "taxonomy", slug);
      const post = getCurrentPost();
      return {
        hasCreateAction: _taxonomy ? !!post._links?.["wp:action-create-" + _taxonomy.rest_base] : false,
        hasAssignAction: _taxonomy ? !!post._links?.["wp:action-assign-" + _taxonomy.rest_base] : false,
        terms: _taxonomy ? getEditedPostAttribute(_taxonomy.rest_base) : EMPTY_ARRAY,
        loading: isResolving("getEntityRecords", [
          "taxonomy",
          slug,
          DEFAULT_QUERY
        ]),
        availableTerms: getEntityRecords("taxonomy", slug, DEFAULT_QUERY) || EMPTY_ARRAY,
        taxonomy: _taxonomy
      };
    },
    [slug]
  );
  const { editPost } = (0, import_data.useDispatch)(import_store.store);
  const { saveEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const availableTermsTree = (0, import_element.useMemo)(
    () => sortBySelected((0, import_terms.buildTermsTree)(availableTerms), terms),
    // Remove `terms` from the dependency list to avoid reordering every time
    // checking or unchecking a term.
    [availableTerms]
  );
  const { createErrorNotice } = (0, import_data.useDispatch)(import_notices.store);
  if (!hasAssignAction) {
    return null;
  }
  const addTerm = (term) => {
    return saveEntityRecord("taxonomy", slug, term, {
      throwOnError: true
    });
  };
  const onUpdateTerms = (termIds) => {
    editPost({ [taxonomy.rest_base]: termIds });
  };
  const onChange = (termId) => {
    const hasTerm = terms.includes(termId);
    const newTerms = hasTerm ? terms.filter((id) => id !== termId) : [...terms, termId];
    onUpdateTerms(newTerms);
  };
  const onChangeFormName = (value) => {
    setFormName(value);
  };
  const onChangeFormParent = (parentId) => {
    setFormParent(parentId);
  };
  const onToggleForm = () => {
    setShowForm(!showForm);
  };
  const onAddTerm = async (event) => {
    event.preventDefault();
    if (formName === "" || adding) {
      return;
    }
    const existingTerm = findTerm(availableTerms, formParent, formName);
    if (existingTerm) {
      if (!terms.some((term) => term === existingTerm.id)) {
        onUpdateTerms([...terms, existingTerm.id]);
      }
      setFormName("");
      setFormParent("");
      return;
    }
    setAdding(true);
    let newTerm;
    try {
      newTerm = await addTerm({
        name: formName,
        parent: formParent ? formParent : void 0
      });
    } catch (error) {
      createErrorNotice(error.message, {
        type: "snackbar"
      });
      return;
    }
    const defaultName = slug === "category" ? (0, import_i18n.__)("Category") : (0, import_i18n.__)("Term");
    const termAddedMessage = (0, import_i18n.sprintf)(
      /* translators: %s: term name. */
      (0, import_i18n._x)("%s added", "term"),
      taxonomy?.labels?.singular_name ?? defaultName
    );
    (0, import_a11y.speak)(termAddedMessage, "assertive");
    setAdding(false);
    setFormName("");
    setFormParent("");
    onUpdateTerms([...terms, newTerm.id]);
  };
  const setFilter = (value) => {
    const newFilteredTermsTree = availableTermsTree.map(getFilterMatcher(value)).filter((term) => term);
    const getResultCount = (termsTree) => {
      let count = 0;
      for (let i = 0; i < termsTree.length; i++) {
        count++;
        if (void 0 !== termsTree[i].children) {
          count += getResultCount(termsTree[i].children);
        }
      }
      return count;
    };
    setFilterValue(value);
    setFilteredTermsTree(newFilteredTermsTree);
    const resultCount = getResultCount(newFilteredTermsTree);
    const resultsFoundMessage = (0, import_i18n.sprintf)(
      /* translators: %d: number of results. */
      (0, import_i18n._n)("%d result found.", "%d results found.", resultCount),
      resultCount
    );
    debouncedSpeak(resultsFoundMessage, "assertive");
  };
  const renderTerms = (renderedTerms) => {
    return renderedTerms.map((term) => {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "div",
        {
          className: "editor-post-taxonomies__hierarchical-terms-choice",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.CheckboxControl,
              {
                checked: terms.indexOf(term.id) !== -1,
                onChange: () => {
                  const termId = parseInt(term.id, 10);
                  onChange(termId);
                },
                label: (0, import_html_entities.decodeEntities)(term.name)
              }
            ),
            !!term.children.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-taxonomies__hierarchical-terms-subchoices", children: renderTerms(term.children) })
          ]
        },
        term.id
      );
    });
  };
  const labelWithFallback = (labelProperty, fallbackIsCategory, fallbackIsNotCategory) => taxonomy?.labels?.[labelProperty] ?? (slug === "category" ? fallbackIsCategory : fallbackIsNotCategory);
  const newTermButtonLabel = labelWithFallback(
    "add_new_item",
    (0, import_i18n.__)("Add Category"),
    (0, import_i18n.__)("Add Term")
  );
  const newTermLabel = labelWithFallback(
    "new_item_name",
    (0, import_i18n.__)("Add Category"),
    (0, import_i18n.__)("Add Term")
  );
  const parentSelectLabel = labelWithFallback(
    "parent_item",
    (0, import_i18n.__)("Parent Category"),
    (0, import_i18n.__)("Parent Term")
  );
  const noParentOption = `\u2014 ${parentSelectLabel} \u2014`;
  const newTermSubmitLabel = newTermButtonLabel;
  const filterLabel = taxonomy?.labels?.search_items ?? (0, import_i18n.__)("Search Terms");
  const groupLabel = taxonomy?.name ?? (0, import_i18n.__)("Terms");
  const showFilter = availableTerms.length >= MIN_TERMS_COUNT_FOR_FILTER;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { direction: "column", gap: "4", children: [
    showFilter && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.SearchControl,
      {
        __next40pxDefaultSize: true,
        label: filterLabel,
        placeholder: filterLabel,
        value: filterValue,
        onChange: setFilter
      }
    ),
    loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Flex,
      {
        justify: "center",
        style: {
          // Match SearchControl height to prevent layout shift.
          height: "40px"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Spinner, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "editor-post-taxonomies__hierarchical-terms-list",
        tabIndex: "0",
        role: "group",
        "aria-label": groupLabel,
        children: renderTerms(
          "" !== filterValue ? filteredTermsTree : availableTermsTree
        )
      }
    ),
    !loading && hasCreateAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        onClick: onToggleForm,
        className: "editor-post-taxonomies__hierarchical-terms-add",
        "aria-expanded": showForm,
        variant: "link",
        children: newTermButtonLabel
      }
    ) }),
    showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", { onSubmit: onAddTerm, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.Flex, { direction: "column", gap: "4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.TextControl,
        {
          __next40pxDefaultSize: true,
          className: "editor-post-taxonomies__hierarchical-terms-input",
          label: newTermLabel,
          value: formName,
          onChange: onChangeFormName,
          required: true
        }
      ),
      !!availableTerms.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.TreeSelect,
        {
          __next40pxDefaultSize: true,
          label: parentSelectLabel,
          noOptionLabel: noParentOption,
          onChange: onChangeFormParent,
          selectedId: formParent,
          tree: availableTermsTree
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          variant: "secondary",
          type: "submit",
          className: "editor-post-taxonomies__hierarchical-terms-submit",
          children: newTermSubmitLabel
        }
      ) })
    ] }) })
  ] });
}
var hierarchical_term_selector_default = (0, import_components.withFilters)("editor.PostTaxonomyType")(
  HierarchicalTermSelector
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HierarchicalTermSelector,
  findTerm,
  getFilterMatcher,
  sortBySelected
});
//# sourceMappingURL=hierarchical-term-selector.cjs.map
