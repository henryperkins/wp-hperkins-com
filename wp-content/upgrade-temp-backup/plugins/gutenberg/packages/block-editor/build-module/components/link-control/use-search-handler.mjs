// packages/block-editor/src/components/link-control/use-search-handler.js
import { useCallback } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import isURLLike from "./is-url-like.mjs";
import normalizeUrl from "./normalize-url.mjs";
import { CREATE_TYPE } from "./constants.mjs";
import { store as blockEditorStore } from "../../store/index.mjs";
var handleNoop = () => Promise.resolve([]);
var handleDirectEntry = (val) => {
  const { url, type } = normalizeUrl(val);
  return Promise.resolve([
    {
      id: val,
      title: val,
      url,
      type
    }
  ]);
};
var handleEntitySearch = async (val, suggestionsQuery, fetchSearchSuggestions, withCreateSuggestion, pageOnFront, pageForPosts) => {
  const { isInitialSuggestions } = suggestionsQuery;
  const results = await fetchSearchSuggestions(val, suggestionsQuery);
  results.map((result) => {
    if (Number(result.id) === pageOnFront) {
      result.isFrontPage = true;
      return result;
    } else if (Number(result.id) === pageForPosts) {
      result.isBlogHome = true;
      return result;
    }
    return result;
  });
  if (isInitialSuggestions) {
    return results;
  }
  return isURLLike(val) || !withCreateSuggestion ? results : results.concat({
    // the `id` prop is intentionally omitted here because it
    // is never exposed as part of the component's public API.
    // see: https://github.com/WordPress/gutenberg/pull/19775#discussion_r378931316.
    title: val,
    // Must match the existing `<input>`s text value.
    url: val,
    // Must match the existing `<input>`s text value.
    type: CREATE_TYPE
  });
};
function useSearchHandler(suggestionsQuery, allowDirectEntry, withCreateSuggestion) {
  const { fetchSearchSuggestions, pageOnFront, pageForPosts } = useSelect(
    (select) => {
      const { getSettings } = select(blockEditorStore);
      return {
        pageOnFront: getSettings().pageOnFront,
        pageForPosts: getSettings().pageForPosts,
        fetchSearchSuggestions: getSettings().__experimentalFetchLinkSuggestions
      };
    },
    []
  );
  const directEntryHandler = allowDirectEntry ? handleDirectEntry : handleNoop;
  return useCallback(
    (val, { isInitialSuggestions }) => {
      return isURLLike(val) ? directEntryHandler(val, { isInitialSuggestions }) : handleEntitySearch(
        val,
        { ...suggestionsQuery, isInitialSuggestions },
        fetchSearchSuggestions,
        withCreateSuggestion,
        pageOnFront,
        pageForPosts
      );
    },
    [
      directEntryHandler,
      fetchSearchSuggestions,
      pageOnFront,
      pageForPosts,
      suggestionsQuery,
      withCreateSuggestion
    ]
  );
}
export {
  useSearchHandler as default,
  handleDirectEntry,
  handleNoop
};
//# sourceMappingURL=use-search-handler.mjs.map
