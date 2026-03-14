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

// packages/views/src/load-view.ts
var load_view_exports = {};
__export(load_view_exports, {
  loadView: () => loadView
});
module.exports = __toCommonJS(load_view_exports);
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_preference_keys = require("./preference-keys.cjs");
var import_filter_utils = require("./filter-utils.cjs");
async function loadView(config) {
  const { kind, name, slug, defaultView, activeViewOverrides, queryParams } = config;
  const preferenceKey = (0, import_preference_keys.generatePreferenceKey)(kind, name, slug);
  const persistedView = (0, import_data.select)(import_preferences.store).get(
    "core/views",
    preferenceKey
  );
  const baseView = persistedView ?? defaultView;
  const page = queryParams?.page ?? 1;
  const search = queryParams?.search ?? "";
  return (0, import_filter_utils.mergeActiveViewOverrides)(
    {
      ...baseView,
      page,
      search
    },
    activeViewOverrides,
    defaultView
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  loadView
});
//# sourceMappingURL=load-view.cjs.map
