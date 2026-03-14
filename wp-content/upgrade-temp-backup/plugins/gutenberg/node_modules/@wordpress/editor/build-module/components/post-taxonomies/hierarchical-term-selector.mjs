// packages/editor/src/components/post-taxonomies/hierarchical-term-selector.js
import { __, _n, _x, sprintf } from "@wordpress/i18n";
import { useMemo, useState } from "@wordpress/element";
import { store as noticesStore } from "@wordpress/notices";
import {
  Button,
  CheckboxControl,
  TextControl,
  TreeSelect,
  withFilters,
  Flex,
  FlexItem,
  SearchControl,
  Spinner,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { useDebounce } from "@wordpress/compose";
import {
  store as coreStore,
  privateApis as coreDataPrivateApis
} from "@wordpress/core-data";
import { speak } from "@wordpress/a11y";
import { decodeEntities } from "@wordpress/html-entities";
import { buildTermsTree } from "../../utils/terms.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { normalizeTextString } = unlock(componentsPrivateApis);
var { RECEIVE_INTERMEDIATE_RESULTS } = unlock(coreDataPrivateApis);
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
  const [adding, setAdding] = useState(false);
  const [formName, setFormName] = useState("");
  const [formParent, setFormParent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [filteredTermsTree, setFilteredTermsTree] = useState([]);
  const debouncedSpeak = useDebounce(speak, 500);
  const {
    hasCreateAction,
    hasAssignAction,
    terms,
    loading,
    availableTerms,
    taxonomy
  } = useSelect(
    (select) => {
      const { getCurrentPost, getEditedPostAttribute } = select(editorStore);
      const { getEntityRecord, getEntityRecords, isResolving } = select(coreStore);
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
  const { editPost } = useDispatch(editorStore);
  const { saveEntityRecord } = useDispatch(coreStore);
  const availableTermsTree = useMemo(
    () => sortBySelected(buildTermsTree(availableTerms), terms),
    // Remove `terms` from the dependency list to avoid reordering every time
    // checking or unchecking a term.
    [availableTerms]
  );
  const { createErrorNotice } = useDispatch(noticesStore);
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
    const defaultName = slug === "category" ? __("Category") : __("Term");
    const termAddedMessage = sprintf(
      /* translators: %s: term name. */
      _x("%s added", "term"),
      taxonomy?.labels?.singular_name ?? defaultName
    );
    speak(termAddedMessage, "assertive");
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
    const resultsFoundMessage = sprintf(
      /* translators: %d: number of results. */
      _n("%d result found.", "%d results found.", resultCount),
      resultCount
    );
    debouncedSpeak(resultsFoundMessage, "assertive");
  };
  const renderTerms = (renderedTerms) => {
    return renderedTerms.map((term) => {
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "editor-post-taxonomies__hierarchical-terms-choice",
          children: [
            /* @__PURE__ */ jsx(
              CheckboxControl,
              {
                checked: terms.indexOf(term.id) !== -1,
                onChange: () => {
                  const termId = parseInt(term.id, 10);
                  onChange(termId);
                },
                label: decodeEntities(term.name)
              }
            ),
            !!term.children.length && /* @__PURE__ */ jsx("div", { className: "editor-post-taxonomies__hierarchical-terms-subchoices", children: renderTerms(term.children) })
          ]
        },
        term.id
      );
    });
  };
  const labelWithFallback = (labelProperty, fallbackIsCategory, fallbackIsNotCategory) => taxonomy?.labels?.[labelProperty] ?? (slug === "category" ? fallbackIsCategory : fallbackIsNotCategory);
  const newTermButtonLabel = labelWithFallback(
    "add_new_item",
    __("Add Category"),
    __("Add Term")
  );
  const newTermLabel = labelWithFallback(
    "new_item_name",
    __("Add Category"),
    __("Add Term")
  );
  const parentSelectLabel = labelWithFallback(
    "parent_item",
    __("Parent Category"),
    __("Parent Term")
  );
  const noParentOption = `\u2014 ${parentSelectLabel} \u2014`;
  const newTermSubmitLabel = newTermButtonLabel;
  const filterLabel = taxonomy?.labels?.search_items ?? __("Search Terms");
  const groupLabel = taxonomy?.name ?? __("Terms");
  const showFilter = availableTerms.length >= MIN_TERMS_COUNT_FOR_FILTER;
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: "4", children: [
    showFilter && !loading && /* @__PURE__ */ jsx(
      SearchControl,
      {
        __next40pxDefaultSize: true,
        label: filterLabel,
        placeholder: filterLabel,
        value: filterValue,
        onChange: setFilter
      }
    ),
    loading && /* @__PURE__ */ jsx(
      Flex,
      {
        justify: "center",
        style: {
          // Match SearchControl height to prevent layout shift.
          height: "40px"
        },
        children: /* @__PURE__ */ jsx(Spinner, {})
      }
    ),
    /* @__PURE__ */ jsx(
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
    !loading && hasCreateAction && /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        onClick: onToggleForm,
        className: "editor-post-taxonomies__hierarchical-terms-add",
        "aria-expanded": showForm,
        variant: "link",
        children: newTermButtonLabel
      }
    ) }),
    showForm && /* @__PURE__ */ jsx("form", { onSubmit: onAddTerm, children: /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: "4", children: [
      /* @__PURE__ */ jsx(
        TextControl,
        {
          __next40pxDefaultSize: true,
          className: "editor-post-taxonomies__hierarchical-terms-input",
          label: newTermLabel,
          value: formName,
          onChange: onChangeFormName,
          required: true
        }
      ),
      !!availableTerms.length && /* @__PURE__ */ jsx(
        TreeSelect,
        {
          __next40pxDefaultSize: true,
          label: parentSelectLabel,
          noOptionLabel: noParentOption,
          onChange: onChangeFormParent,
          selectedId: formParent,
          tree: availableTermsTree
        }
      ),
      /* @__PURE__ */ jsx(FlexItem, { children: /* @__PURE__ */ jsx(
        Button,
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
var hierarchical_term_selector_default = withFilters("editor.PostTaxonomyType")(
  HierarchicalTermSelector
);
export {
  HierarchicalTermSelector,
  hierarchical_term_selector_default as default,
  findTerm,
  getFilterMatcher,
  sortBySelected
};
//# sourceMappingURL=hierarchical-term-selector.mjs.map
