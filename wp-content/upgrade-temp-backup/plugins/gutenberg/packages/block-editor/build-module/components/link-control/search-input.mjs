// packages/block-editor/src/components/link-control/search-input.js
import { forwardRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import deprecated from "@wordpress/deprecated";
import { URLInput } from "../index.mjs";
import LinkControlSearchResults from "./search-results.mjs";
import { CREATE_TYPE } from "./constants.mjs";
import useSearchHandler from "./use-search-handler.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var noopSearchHandler = () => Promise.resolve([]);
var noop = () => {
};
var LinkControlSearchInput = forwardRef(
  ({
    value,
    children,
    currentLink = {},
    className = null,
    placeholder = null,
    withCreateSuggestion = false,
    onCreateSuggestion = noop,
    onChange = noop,
    onSelect = noop,
    showSuggestions = true,
    renderSuggestions = (props) => /* @__PURE__ */ jsx(LinkControlSearchResults, { ...props }),
    fetchSuggestions = null,
    allowDirectEntry = true,
    showInitialSuggestions = false,
    suggestionsQuery = {},
    withURLSuggestion = true,
    createSuggestionButtonText,
    hideLabelFromVision = false,
    suffix,
    isEntity = false,
    customValidity: customValidityProp
  }, ref) => {
    const genericSearchHandler = useSearchHandler(
      suggestionsQuery,
      allowDirectEntry,
      withCreateSuggestion,
      withURLSuggestion
    );
    const searchHandler = showSuggestions ? fetchSuggestions || genericSearchHandler : noopSearchHandler;
    const [focusedSuggestion, setFocusedSuggestion] = useState();
    const onInputChange = (selection, suggestion) => {
      onChange(selection);
      setFocusedSuggestion(suggestion);
    };
    const handleRenderSuggestions = (props) => renderSuggestions({
      ...props,
      withCreateSuggestion,
      createSuggestionButtonText,
      suggestionsQuery,
      handleSuggestionClick: (suggestion) => {
        if (props.handleSuggestionClick) {
          props.handleSuggestionClick(suggestion);
        }
        onSuggestionSelected(suggestion);
      }
    });
    const onSuggestionSelected = async (selectedSuggestion) => {
      let suggestion = selectedSuggestion;
      if (CREATE_TYPE === selectedSuggestion.type) {
        try {
          suggestion = await onCreateSuggestion(
            selectedSuggestion.title
          );
          if (suggestion?.url) {
            onSelect(suggestion);
          }
        } catch (e) {
        }
        return;
      }
      if (allowDirectEntry || suggestion && Object.keys(suggestion).length >= 1) {
        const { id, url, kind, type, ...restLinkProps } = currentLink ?? {};
        onSelect(
          // Some direct entries don't have types or IDs, and we still need to clear the previous ones.
          { ...restLinkProps, ...suggestion },
          suggestion
        );
      }
    };
    const _placeholder = placeholder ?? __("Search or type URL");
    const label = hideLabelFromVision && placeholder !== "" ? _placeholder : __("Link");
    return /* @__PURE__ */ jsxs("div", { className: "block-editor-link-control__search-input-container", children: [
      /* @__PURE__ */ jsx(
        URLInput,
        {
          disableSuggestions: currentLink?.url === value,
          label,
          hideLabelFromVision,
          className,
          value,
          onChange: onInputChange,
          placeholder: _placeholder,
          __experimentalRenderSuggestions: showSuggestions ? handleRenderSuggestions : null,
          __experimentalFetchLinkSuggestions: searchHandler,
          __experimentalHandleURLSuggestions: true,
          __experimentalShowInitialSuggestions: showInitialSuggestions,
          customValidity: customValidityProp,
          required: false,
          onSubmit: (suggestion, event) => {
            const hasSuggestion = suggestion || focusedSuggestion;
            if (!hasSuggestion && !value?.trim()?.length) {
              event.preventDefault();
            } else {
              onSuggestionSelected(
                hasSuggestion || { url: value }
              );
            }
          },
          inputRef: ref,
          suffix,
          disabled: isEntity
        }
      ),
      children
    ] });
  }
);
var search_input_default = LinkControlSearchInput;
var __experimentalLinkControlSearchInput = (props) => {
  deprecated("wp.blockEditor.__experimentalLinkControlSearchInput", {
    since: "6.8"
  });
  return /* @__PURE__ */ jsx(LinkControlSearchInput, { ...props });
};
export {
  __experimentalLinkControlSearchInput,
  search_input_default as default
};
//# sourceMappingURL=search-input.mjs.map
