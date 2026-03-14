// packages/views/src/load-view.ts
import { select } from "@wordpress/data";
import { store as preferencesStore } from "@wordpress/preferences";
import { generatePreferenceKey } from "./preference-keys.mjs";
import { mergeActiveViewOverrides } from "./filter-utils.mjs";
async function loadView(config) {
  const { kind, name, slug, defaultView, activeViewOverrides, queryParams } = config;
  const preferenceKey = generatePreferenceKey(kind, name, slug);
  const persistedView = select(preferencesStore).get(
    "core/views",
    preferenceKey
  );
  const baseView = persistedView ?? defaultView;
  const page = queryParams?.page ?? 1;
  const search = queryParams?.search ?? "";
  return mergeActiveViewOverrides(
    {
      ...baseView,
      page,
      search
    },
    activeViewOverrides,
    defaultView
  );
}
export {
  loadView
};
//# sourceMappingURL=load-view.mjs.map
