// packages/sync/src/providers/index.ts
import { applyFilters } from "@wordpress/hooks";
import { createHttpPollingProvider } from "./http-polling/http-polling-provider.mjs";
var providerCreators = null;
function getDefaultProviderCreators() {
  return [createHttpPollingProvider()];
}
function isProviderCreator(creator) {
  return "function" === typeof creator;
}
function getProviderCreators() {
  if (providerCreators) {
    return providerCreators;
  }
  if (!window._wpCollaborationEnabled) {
    return [];
  }
  const filteredProviderCreators = applyFilters(
    "sync.providers",
    getDefaultProviderCreators()
  );
  if (!Array.isArray(filteredProviderCreators)) {
    providerCreators = [];
    return providerCreators;
  }
  providerCreators = filteredProviderCreators.filter(isProviderCreator);
  return providerCreators;
}
export {
  getDefaultProviderCreators,
  getProviderCreators
};
//# sourceMappingURL=index.mjs.map
