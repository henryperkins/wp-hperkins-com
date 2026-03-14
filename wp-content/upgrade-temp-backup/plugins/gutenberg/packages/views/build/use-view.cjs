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

// packages/views/src/use-view.ts
var use_view_exports = {};
__export(use_view_exports, {
  useView: () => useView
});
module.exports = __toCommonJS(use_view_exports);
var import_dequal = require("dequal");
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_preferences = require("@wordpress/preferences");
var import_preference_keys = require("./preference-keys.cjs");
var import_filter_utils = require("./filter-utils.cjs");
function omit(obj, keys) {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
function useView(config) {
  const {
    kind,
    name,
    slug,
    defaultView,
    activeViewOverrides,
    queryParams,
    onChangeQueryParams
  } = config;
  const preferenceKey = (0, import_preference_keys.generatePreferenceKey)(kind, name, slug);
  const persistedView = (0, import_data.useSelect)(
    (select) => {
      return select(import_preferences.store).get(
        "core/views",
        preferenceKey
      );
    },
    [preferenceKey]
  );
  const { set } = (0, import_data.useDispatch)(import_preferences.store);
  const baseView = persistedView ?? defaultView;
  const page = Number(queryParams?.page ?? baseView.page ?? 1);
  const search = queryParams?.search ?? baseView.search ?? "";
  const view = (0, import_element.useMemo)(() => {
    return (0, import_filter_utils.mergeActiveViewOverrides)(
      {
        ...baseView,
        page,
        search
      },
      activeViewOverrides,
      defaultView
    );
  }, [baseView, page, search, activeViewOverrides, defaultView]);
  const isModified = !!persistedView;
  const updateView = (0, import_element.useCallback)(
    (newView) => {
      const urlParams = {
        page: newView?.page,
        search: newView?.search
      };
      const preferenceView = (0, import_filter_utils.stripActiveViewOverrides)(
        omit(newView, ["page", "search"]),
        activeViewOverrides,
        defaultView
      );
      if (onChangeQueryParams && !(0, import_dequal.dequal)(urlParams, { page, search })) {
        onChangeQueryParams(urlParams);
      }
      const comparableBaseView = (0, import_filter_utils.stripActiveViewOverrides)(
        baseView,
        activeViewOverrides,
        defaultView
      );
      const comparableDefaultView = (0, import_filter_utils.stripActiveViewOverrides)(
        defaultView,
        activeViewOverrides,
        defaultView
      );
      if (!(0, import_dequal.dequal)(comparableBaseView, preferenceView)) {
        if ((0, import_dequal.dequal)(preferenceView, comparableDefaultView)) {
          set("core/views", preferenceKey, void 0);
        } else {
          set("core/views", preferenceKey, preferenceView);
        }
      }
    },
    [
      onChangeQueryParams,
      page,
      search,
      baseView,
      defaultView,
      activeViewOverrides,
      set,
      preferenceKey
    ]
  );
  const resetToDefault = (0, import_element.useCallback)(() => {
    set("core/views", preferenceKey, void 0);
  }, [preferenceKey, set]);
  return {
    view,
    isModified,
    updateView,
    resetToDefault
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useView
});
//# sourceMappingURL=use-view.cjs.map
