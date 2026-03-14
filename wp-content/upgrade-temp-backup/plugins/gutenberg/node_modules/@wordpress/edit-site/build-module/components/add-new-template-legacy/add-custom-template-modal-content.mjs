// packages/edit-site/src/components/add-new-template-legacy/add-custom-template-modal-content.js
import { useState, useMemo, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  Button,
  Flex,
  FlexItem,
  SearchControl,
  TextHighlight,
  Composite,
  __experimentalText as Text,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useEntityRecords } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import { useDebouncedInput } from "@wordpress/compose";
import { focus } from "@wordpress/dom";
import { safeDecodeURI } from "@wordpress/url";
import { mapToIHasNameAndId } from "./utils.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var EMPTY_ARRAY = [];
function SuggestionListItem({
  suggestion,
  search,
  onSelect,
  entityForSuggestions
}) {
  const baseCssClass = "edit-site-custom-template-modal__suggestions_list__list-item";
  return /* @__PURE__ */ jsxs(
    Composite.Item,
    {
      render: /* @__PURE__ */ jsx(
        Button,
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
        /* @__PURE__ */ jsx(
          Text,
          {
            size: "body",
            lineHeight: 1.53846153846,
            weight: 500,
            className: `${baseCssClass}__title`,
            children: /* @__PURE__ */ jsx(
              TextHighlight,
              {
                text: decodeEntities(suggestion.name),
                highlight: search
              }
            )
          }
        ),
        suggestion.link && /* @__PURE__ */ jsx(
          Text,
          {
            size: "body",
            lineHeight: 1.53846153846,
            className: `${baseCssClass}__info`,
            children: safeDecodeURI(suggestion.link)
          }
        )
      ]
    }
  );
}
function useSearchSuggestions(entityForSuggestions, search) {
  const { config } = entityForSuggestions;
  const query = useMemo(
    () => ({
      order: "asc",
      context: "view",
      search,
      per_page: search ? 20 : 10,
      ...config.queryArgs(search)
    }),
    [search, config]
  );
  const { records: searchResults, hasResolved: searchHasResolved } = useEntityRecords(
    entityForSuggestions.type,
    entityForSuggestions.slug,
    query
  );
  const [suggestions, setSuggestions] = useState(EMPTY_ARRAY);
  useEffect(() => {
    if (!searchHasResolved) {
      return;
    }
    let newSuggestions = EMPTY_ARRAY;
    if (searchResults?.length) {
      newSuggestions = searchResults;
      if (config.recordNamePath) {
        newSuggestions = mapToIHasNameAndId(
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
  const [search, setSearch, debouncedSearch] = useDebouncedInput();
  const suggestions = useSearchSuggestions(
    entityForSuggestions,
    debouncedSearch
  );
  const { labels } = entityForSuggestions;
  const [showSearchControl, setShowSearchControl] = useState(false);
  if (!showSearchControl && suggestions?.length > 9) {
    setShowSearchControl(true);
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    showSearchControl && /* @__PURE__ */ jsx(
      SearchControl,
      {
        onChange: setSearch,
        value: search,
        label: labels.search_items,
        placeholder: labels.search_items
      }
    ),
    !!suggestions?.length && /* @__PURE__ */ jsx(
      Composite,
      {
        orientation: "vertical",
        role: "listbox",
        className: "edit-site-custom-template-modal__suggestions_list",
        "aria-label": __("Suggestions list"),
        children: suggestions.map((suggestion) => /* @__PURE__ */ jsx(
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
    debouncedSearch && !suggestions?.length && /* @__PURE__ */ jsx(
      Text,
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
  const [showSearchEntities, setShowSearchEntities] = useState(
    entityForSuggestions.hasGeneralTemplate
  );
  useEffect(() => {
    if (containerRef.current) {
      const [firstFocusable] = focus.focusable.find(
        containerRef.current
      );
      firstFocusable?.focus();
    }
  }, [showSearchEntities]);
  return /* @__PURE__ */ jsxs(
    VStack,
    {
      spacing: 4,
      className: "edit-site-custom-template-modal__contents-wrapper",
      alignment: "left",
      children: [
        !showSearchEntities && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Text, { as: "p", children: __(
            "Select whether to create a single template for all items or a specific one."
          ) }),
          /* @__PURE__ */ jsxs(
            Flex,
            {
              className: "edit-site-custom-template-modal__contents",
              gap: "4",
              align: "initial",
              children: [
                /* @__PURE__ */ jsxs(
                  FlexItem,
                  {
                    isBlock: true,
                    as: Button,
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
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          as: "span",
                          weight: 500,
                          lineHeight: 1.53846153846,
                          children: entityForSuggestions.labels.all_items
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          as: "span",
                          lineHeight: 1.53846153846,
                          // translators: The user is given the choice to set up a template for all items of a post type or taxonomy, or just a specific one.
                          children: __("For all items")
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  FlexItem,
                  {
                    isBlock: true,
                    as: Button,
                    onClick: () => {
                      setShowSearchEntities(true);
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          as: "span",
                          weight: 500,
                          lineHeight: 1.53846153846,
                          children: entityForSuggestions.labels.singular_name
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Text,
                        {
                          as: "span",
                          lineHeight: 1.53846153846,
                          // translators: The user is given the choice to set up a template for all items of a post type or taxonomy, or just a specific one.
                          children: __("For a specific item")
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(Flex, { justify: "right", children: /* @__PURE__ */ jsx(
            Button,
            {
              __next40pxDefaultSize: true,
              variant: "tertiary",
              onClick: onBack,
              children: __("Back")
            }
          ) })
        ] }),
        showSearchEntities && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Text, { as: "p", children: __(
            "This template will be used only for the specific item chosen."
          ) }),
          /* @__PURE__ */ jsx(
            SuggestionList,
            {
              entityForSuggestions,
              onSelect
            }
          ),
          /* @__PURE__ */ jsx(Flex, { justify: "right", children: /* @__PURE__ */ jsx(
            Button,
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
              children: __("Back")
            }
          ) })
        ] })
      ]
    }
  );
}
var add_custom_template_modal_content_default = AddCustomTemplateModalContent;
export {
  add_custom_template_modal_content_default as default
};
//# sourceMappingURL=add-custom-template-modal-content.mjs.map
