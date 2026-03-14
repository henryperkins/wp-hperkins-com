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

// packages/edit-site/src/components/add-new-template-legacy/add-custom-template-modal-content.js
var add_custom_template_modal_content_exports = {};
__export(add_custom_template_modal_content_exports, {
  default: () => add_custom_template_modal_content_default
});
module.exports = __toCommonJS(add_custom_template_modal_content_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_html_entities = require("@wordpress/html-entities");
var import_compose = require("@wordpress/compose");
var import_dom = require("@wordpress/dom");
var import_url = require("@wordpress/url");
var import_utils = require("./utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_ARRAY = [];
function SuggestionListItem({
  suggestion,
  search,
  onSelect,
  entityForSuggestions
}) {
  const baseCssClass = "edit-site-custom-template-modal__suggestions_list__list-item";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Composite.Item,
    {
      render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          role: "option",
          className: baseCssClass,
          onClick: () => onSelect(
            entityForSuggestions.config.getSpecificTemplate(
              suggestion
            )
          )
        }
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalText,
          {
            size: "body",
            lineHeight: 1.53846153846,
            weight: 500,
            className: `${baseCssClass}__title`,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.TextHighlight,
              {
                text: (0, import_html_entities.decodeEntities)(suggestion.name),
                highlight: search
              }
            )
          }
        ),
        suggestion.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalText,
          {
            size: "body",
            lineHeight: 1.53846153846,
            className: `${baseCssClass}__info`,
            children: (0, import_url.safeDecodeURI)(suggestion.link)
          }
        )
      ]
    }
  );
}
function useSearchSuggestions(entityForSuggestions, search) {
  const { config } = entityForSuggestions;
  const query = (0, import_element.useMemo)(
    () => ({
      order: "asc",
      context: "view",
      search,
      per_page: search ? 20 : 10,
      ...config.queryArgs(search)
    }),
    [search, config]
  );
  const { records: searchResults, hasResolved: searchHasResolved } = (0, import_core_data.useEntityRecords)(
    entityForSuggestions.type,
    entityForSuggestions.slug,
    query
  );
  const [suggestions, setSuggestions] = (0, import_element.useState)(EMPTY_ARRAY);
  (0, import_element.useEffect)(() => {
    if (!searchHasResolved) {
      return;
    }
    let newSuggestions = EMPTY_ARRAY;
    if (searchResults?.length) {
      newSuggestions = searchResults;
      if (config.recordNamePath) {
        newSuggestions = (0, import_utils.mapToIHasNameAndId)(
          newSuggestions,
          config.recordNamePath
        );
      }
    }
    setSuggestions(newSuggestions);
  }, [searchResults, searchHasResolved]);
  return suggestions;
}
function SuggestionList({ entityForSuggestions, onSelect }) {
  const [search, setSearch, debouncedSearch] = (0, import_compose.useDebouncedInput)();
  const suggestions = useSearchSuggestions(
    entityForSuggestions,
    debouncedSearch
  );
  const { labels } = entityForSuggestions;
  const [showSearchControl, setShowSearchControl] = (0, import_element.useState)(false);
  if (!showSearchControl && suggestions?.length > 9) {
    setShowSearchControl(true);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    showSearchControl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.SearchControl,
      {
        onChange: setSearch,
        value: search,
        label: labels.search_items,
        placeholder: labels.search_items
      }
    ),
    !!suggestions?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Composite,
      {
        orientation: "vertical",
        role: "listbox",
        className: "edit-site-custom-template-modal__suggestions_list",
        "aria-label": (0, import_i18n.__)("Suggestions list"),
        children: suggestions.map((suggestion) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          SuggestionListItem,
          {
            suggestion,
            search: debouncedSearch,
            onSelect,
            entityForSuggestions
          },
          suggestion.slug
        ))
      }
    ),
    debouncedSearch && !suggestions?.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalText,
      {
        as: "p",
        className: "edit-site-custom-template-modal__no-results",
        children: labels.not_found
      }
    )
  ] });
}
function AddCustomTemplateModalContent({
  onSelect,
  entityForSuggestions,
  onBack,
  containerRef
}) {
  const [showSearchEntities, setShowSearchEntities] = (0, import_element.useState)(
    entityForSuggestions.hasGeneralTemplate
  );
  (0, import_element.useEffect)(() => {
    if (containerRef.current) {
      const [firstFocusable] = import_dom.focus.focusable.find(
        containerRef.current
      );
      firstFocusable?.focus();
    }
  }, [showSearchEntities]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      spacing: 4,
      className: "edit-site-custom-template-modal__contents-wrapper",
      alignment: "left",
      children: [
        !showSearchEntities && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "p", children: (0, import_i18n.__)(
            "Select whether to create a single template for all items or a specific one."
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_components.Flex,
            {
              className: "edit-site-custom-template-modal__contents",
              gap: "4",
              align: "initial",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  import_components.FlexItem,
                  {
                    isBlock: true,
                    as: import_components.Button,
                    onClick: () => {
                      const {
                        slug,
                        title,
                        description,
                        templatePrefix
                      } = entityForSuggestions.template;
                      onSelect({
                        slug,
                        title,
                        description,
                        templatePrefix
                      });
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_components.__experimentalText,
                        {
                          as: "span",
                          weight: 500,
                          lineHeight: 1.53846153846,
                          children: entityForSuggestions.labels.all_items
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_components.__experimentalText,
                        {
                          as: "span",
                          lineHeight: 1.53846153846,
                          // translators: The user is given the choice to set up a template for all items of a post type or taxonomy, or just a specific one.
                          children: (0, import_i18n.__)("For all items")
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  import_components.FlexItem,
                  {
                    isBlock: true,
                    as: import_components.Button,
                    onClick: () => {
                      setShowSearchEntities(true);
                    },
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_components.__experimentalText,
                        {
                          as: "span",
                          weight: 500,
                          lineHeight: 1.53846153846,
                          children: entityForSuggestions.labels.singular_name
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_components.__experimentalText,
                        {
                          as: "span",
                          lineHeight: 1.53846153846,
                          // translators: The user is given the choice to set up a template for all items of a post type or taxonomy, or just a specific one.
                          children: (0, import_i18n.__)("For a specific item")
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Flex, { justify: "right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: onBack,
              children: (0, import_i18n.__)("Back")
            }
          ) })
        ] }),
        showSearchEntities && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "p", children: (0, import_i18n.__)(
            "This template will be used only for the specific item chosen."
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            SuggestionList,
            {
              entityForSuggestions,
              onSelect
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Flex, { justify: "right", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: () => {
                if (entityForSuggestions.hasGeneralTemplate) {
                  onBack();
                } else {
                  setShowSearchEntities(false);
                }
              },
              children: (0, import_i18n.__)("Back")
            }
          ) })
        ] })
      ]
    }
  );
}
var add_custom_template_modal_content_default = AddCustomTemplateModalContent;
//# sourceMappingURL=add-custom-template-modal-content.cjs.map
