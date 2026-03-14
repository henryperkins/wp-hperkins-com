// packages/views/src/use-view.ts
import { dequal } from "dequal";
import { useCallback, useMemo } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import { generatePreferenceKey } from "./preference-keys.mjs";
import {
  mergeActiveViewOverrides,
  stripActiveViewOverrides
} from "./filter-utils.mjs";
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
  const preferenceKey = generatePreferenceKey(kind, name, slug);
  const persistedView = useSelect(
    (select) => {
      return select(preferencesStore).get(
        "core/views",
        preferenceKey
      );
    },
    [preferenceKey]
  );
  const { set } = useDispatch(preferencesStore);
  const baseView = persistedView ?? defaultView;
  const page = Number(queryParams?.page ?? baseView.page ?? 1);
  const search = queryParams?.search ?? baseView.search ?? "";
  const view = useMemo(() => {
    return mergeActiveViewOverrides(
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
  const updateView = useCallback(
    (newView) => {
      const urlParams = {
        page: newView?.page,
        search: newView?.search
      };
      const preferenceView = stripActiveViewOverrides(
        omit(newView, ["page", "search"]),
        activeViewOverrides,
        defaultView
      );
      if (onChangeQueryParams && !dequal(urlParams, { page, search })) {
        onChangeQueryParams(urlParams);
      }
      const comparableBaseView = stripActiveViewOverrides(
        baseView,
        activeViewOverrides,
        defaultView
      );
      const comparableDefaultView = stripActiveViewOverrides(
        defaultView,
        activeViewOverrides,
        defaultView
      );
      if (!dequal(comparableBaseView, preferenceView)) {
        if (dequal(preferenceView, comparableDefaultView)) {
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
  const resetToDefault = useCallback(() => {
    set("core/views", preferenceKey, void 0);
  }, [preferenceKey, set]);
  return {
    view,
    isModified,
    updateView,
    resetToDefault
  };
}
export {
  useView
};
//# sourceMappingURL=use-view.mjs.map
