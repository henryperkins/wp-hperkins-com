// packages/core-data/src/fetch/index.js
import { camelCase } from "change-case";
import apiFetch from "@wordpress/api-fetch";
import { default as default2 } from "./__experimental-fetch-link-suggestions.mjs";
import { default as default3 } from "./__experimental-fetch-url-data.mjs";
async function fetchBlockPatterns() {
  const restPatterns = await apiFetch({
    path: "/wp/v2/block-patterns/patterns"
  });
  if (!restPatterns) {
    return [];
  }
  return restPatterns.map(
    (pattern) => Object.fromEntries(
      Object.entries(pattern).map(([key, value]) => [
        camelCase(key),
        value
      ])
    )
  );
}
export {
  default2 as __experimentalFetchLinkSuggestions,
  default3 as __experimentalFetchUrlData,
  fetchBlockPatterns
};
//# sourceMappingURL=index.mjs.map
