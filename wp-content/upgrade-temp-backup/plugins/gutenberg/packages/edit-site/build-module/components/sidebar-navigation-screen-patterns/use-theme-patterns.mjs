// packages/edit-site/src/components/sidebar-navigation-screen-patterns/use-theme-patterns.js
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { filterOutDuplicatesByName } from "../page-patterns/utils.mjs";
import { EXCLUDED_PATTERN_SOURCES } from "../../utils/constants.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { store as editSiteStore } from "../../store/index.mjs";
function useThemePatterns() {
  const blockPatterns = useSelect((select) => {
    const { getSettings } = unlock(select(editSiteStore));
    return getSettings().__experimentalAdditionalBlockPatterns ?? getSettings().__experimentalBlockPatterns;
  });
  const restBlockPatterns = useSelect(
    (select) => select(coreStore).getBlockPatterns()
  );
  const patterns = useMemo(
    () => [...blockPatterns || [], ...restBlockPatterns || []].filter(
      (pattern) => !EXCLUDED_PATTERN_SOURCES.includes(pattern.source)
    ).filter(filterOutDuplicatesByName).filter((pattern) => pattern.inserter !== false),
    [blockPatterns, restBlockPatterns]
  );
  return patterns;
}
export {
  useThemePatterns as default
};
//# sourceMappingURL=use-theme-patterns.mjs.map
