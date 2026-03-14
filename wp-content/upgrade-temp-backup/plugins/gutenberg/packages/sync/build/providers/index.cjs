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

// packages/sync/src/providers/index.ts
var providers_exports = {};
__export(providers_exports, {
  getDefaultProviderCreators: () => getDefaultProviderCreators,
  getProviderCreators: () => getProviderCreators
});
module.exports = __toCommonJS(providers_exports);
var import_hooks = require("@wordpress/hooks");
var import_http_polling_provider = require("./http-polling/http-polling-provider.cjs");
var providerCreators = null;
function getDefaultProviderCreators() {
  return [(0, import_http_polling_provider.createHttpPollingProvider)()];
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
  const filteredProviderCreators = (0, import_hooks.applyFilters)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDefaultProviderCreators,
  getProviderCreators
});
//# sourceMappingURL=index.cjs.map
