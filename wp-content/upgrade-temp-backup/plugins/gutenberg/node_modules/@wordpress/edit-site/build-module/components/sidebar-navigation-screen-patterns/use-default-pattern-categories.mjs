// packages/edit-site/src/components/sidebar-navigation-screen-patterns/use-default-pattern-categories.js
import { store as coreStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import { unlock } from "../../lock-unlock.mjs";
import { store as editSiteStore } from "../../store/index.mjs";
function useDefaultPatternCategories() {
  const blockPatternCategories = useSelect((select) => {
    const { getSettings } = unlock(select(editSiteStore));
    const settings = getSettings();
    return settings.__experimentalAdditionalBlockPatternCategories ?? settings.__experimentalBlockPatternCategories;
  });
  const restBlockPatternCategories = useSelect(
    (select) => select(coreStore).getBlockPatternCategories()
  );
  return [
    ...blockPatternCategories || [],
    ...restBlockPatternCategories || []
  ];
}
export {
  useDefaultPatternCategories as default
};
//# sourceMappingURL=use-default-pattern-categories.mjs.map
